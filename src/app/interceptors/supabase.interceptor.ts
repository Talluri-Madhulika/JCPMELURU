import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseInterceptor implements HttpInterceptor {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://wtifcpkkukfvgkcytkht.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aWZjcGtrdWtmdmdrY3l0a2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODgyMzYsImV4cCI6MjEwNjM2NDIzNn0.PXNpCLQ_wUb_fAzzEBwFPT0aU_PIjlDf5QANfW6x2DM'
    );
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url = request.url;
    if (!url.startsWith('http://localhost:5000/api/')) {
      return next.handle(request);
    }

    const rawPath = url.replace('http://localhost:5000/api/', '');
    const path = rawPath.split('?')[0].split('#')[0]; // Strip query params and hashes
    const parts = path.split('/');
    let endpoint = parts[0];
    let id: string | undefined = parts[1];
    let action: string | undefined = parts.length > 2 ? parts[2] : undefined;

    if (endpoint === 'auth') {
      if (id === 'users') {
        endpoint = 'users';
        id = parts[2];
        action = parts[3];
      } else if (id === 'login' || id === 'signup' || id === 'forgot-password') {
        action = id;
        id = undefined;
      }
    }

    return from(this.handleSupabaseRequest(request.method, endpoint, id, action, request.body)).pipe(
      switchMap(data => of(new HttpResponse({ status: 200, body: data }))),
      catchError(error => {
        console.error('Supabase Error:', error);
        return throwError(() => new HttpErrorResponse({ status: 500, error }));
      })
    );
  }

  private async handleSupabaseRequest(method: string, endpoint: string, id: string | undefined, action: string | undefined, body: any): Promise<any> {
    let table = endpoint;
    if (endpoint === 'action-songs') table = 'action_songs';
    if (endpoint === 'daily-promise' || endpoint === 'daily-promises') table = 'daily_promises';
    if (endpoint === 'short-messages') table = 'short_messages';
    if (endpoint === 'social-channels') table = 'social_channels';
    if (endpoint === 'push') table = 'push_subscriptions';

    if (table === 'auth') {
       if (endpoint !== 'auth' || (action !== 'login' && action !== 'signup')) {
         console.error('ERROR: Interceptor is trying to query public.auth table!', { method, endpoint, id, action, body });
         throw new Error(`Invalid route: ${method} /api/${endpoint}/${id || ''}/${action || ''}`);
       }
    }

    if (method === 'GET') {
      if (id) {
        if (table === 'daily_promises' && id === 'today') {
           const today = new Date().toISOString().split('T')[0];
           const { data, error } = await this.supabase.from(table).select('*').eq('date', today).limit(1);
           if (error) {
              return null; 
           }
           return data && data.length > 0 ? this.mapData(data[0]) : null;
        }
        const { data, error } = await this.supabase.from(table).select('*').eq('id', id).single();
        if (error) throw error;
        return this.mapData(data);
      } else {
        if (table === 'users') {
           const { data, error } = await this.supabase.from('users').select('*').order('created_at', { ascending: false });
           if (error) throw error;
           const users = data.map(d => this.mapData(d));
           return {
              users: users,
              adminCount: users.filter(u => u.role === 'admin').length,
              maxAdmins: 4,
              changeableAdmins: 3,
              permanentAdminEmail: 'tallurimadhulika@gmail.com'
           };
        }

        const { data, error } = await this.supabase.from(table).select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(d => this.mapData(d));
      }
    } else if (method === 'POST') {
      if (endpoint === 'auth' && action === 'login') {
         const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password
         });
         
         if (authError || !authData.user) {
            throw new Error(authError?.message || 'Invalid email or password');
         }
         
         const { data, error } = await this.supabase.from('users').select('*').eq('id', authData.user.id).single();
         return { token: authData.session.access_token, user: this.mapData(data) };
      }
      if (endpoint === 'auth' && action === 'forgot-password') {
         const { data, error } = await this.supabase.auth.resetPasswordForEmail(body.email, {
            redirectTo: 'http://localhost:4200/reset-password' // Note: This should match the production URL eventually
         });
         if (error) throw error;
         return { message: 'Password reset email sent' };
      }
      
      if (endpoint === 'auth' && action === 'signup') {
         const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email: body.email,
            password: body.password
         });
         if (authError) throw authError;

         // Insert into public users table
         const newUser = {
            id: authData.user?.id,
            name: body.name,
            email: body.email,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
         };
         
         const { data, error } = await this.supabase.from('users').insert(newUser).select().single();
         if (error) throw error;
         return { token: authData.session?.access_token || 'mock-token-signup', user: this.mapData(data) };
      }
      
      const mappedBody = this.mapToSnakeCase(body);
      const { data, error } = await this.supabase.from(table).insert(mappedBody).select().single();
      if (error) throw error;
      return this.mapData(data);
    } else if (method === 'PUT' || method === 'PATCH') {
      if (id) {
        if (endpoint === 'users' && action === 'make-admin') {
           const { data, error } = await this.supabase.from('users').update({ role: 'admin' }).eq('id', id).select().single();
           if (error) throw error;
           return this.mapData(data);
        }
        if (endpoint === 'users' && action === 'remove-admin') {
           const { data, error } = await this.supabase.from('users').update({ role: 'user' }).eq('id', id).select().single();
           if (error) throw error;
           return this.mapData(data);
        }
        
        const mappedBody = this.mapToSnakeCase(body);
        const { data, error } = await this.supabase.from(table).update(mappedBody).eq('id', id).select().single();
        if (error) throw error;
        return this.mapData(data);
      }
    } else if (method === 'DELETE') {
      if (id) {
        const { data, error } = await this.supabase.from(table).delete().eq('id', id).select().single();
        if (error) throw error;
        return this.mapData(data);
      }
    }
    
    throw new Error('Method not implemented for Supabase interceptor');
  }

  private mapData(data: any): any {
    if (!data) return data;
    const mapped = { ...data, _id: data.id };
    if (data.youtube_link !== undefined) mapped.youtubeLink = data.youtube_link;
    if (data.audio_link !== undefined) mapped.audioLink = data.audio_link;
    if (data.date_time !== undefined) mapped.dateTime = data.date_time;
    if (data.title_telugu !== undefined) mapped.titleTelugu = data.title_telugu;
    if (data.title_english !== undefined) mapped.titleEnglish = data.title_english;
    if (data.lyrics_telugu !== undefined) mapped.lyricsTelugu = data.lyrics_telugu;
    if (data.lyrics_english !== undefined) mapped.lyricsEnglish = data.lyrics_english;
    if (data.is_active !== undefined) mapped.isActive = data.is_active;
    return mapped;
  }

  private mapToSnakeCase(data: any): any {
    if (!data) return data;
    const mapped = { ...data };
    delete mapped._id;
    delete mapped.id;
    
    // Sanitize empty strings for number fields to prevent PostgreSQL integer parsing errors
    if (mapped.number === '') mapped.number = null;
    
    if (data.youtubeLink !== undefined) { mapped.youtube_link = data.youtubeLink; delete mapped.youtubeLink; }
    if (data.audioLink !== undefined) { mapped.audio_link = data.audioLink; delete mapped.audioLink; }
    if (data.dateTime !== undefined) { mapped.date_time = data.dateTime; delete mapped.dateTime; }
    if (data.titleTelugu !== undefined) { mapped.title_telugu = data.titleTelugu; delete mapped.titleTelugu; }
    if (data.titleEnglish !== undefined) { mapped.title_english = data.titleEnglish; delete mapped.titleEnglish; }
    if (data.lyricsTelugu !== undefined) { mapped.lyrics_telugu = data.lyricsTelugu; delete mapped.lyricsTelugu; }
    if (data.lyricsEnglish !== undefined) { mapped.lyrics_english = data.lyricsEnglish; delete mapped.lyricsEnglish; }
    if (data.isActive !== undefined) { mapped.is_active = data.isActive; delete mapped.isActive; }
    return mapped;
  }
}
