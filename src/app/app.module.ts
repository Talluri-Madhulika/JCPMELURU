import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SongsComponent } from './pages/songs/songs.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ActionSongsComponent } from './pages/action-songs/action-songs.component';
import { ShortMessagesComponent } from './pages/short-messages/short-messages.component';
import { EventsComponent } from './pages/events/events.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SettingsComponent } from './pages/settings/settings.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SocialComponent } from './pages/social/social.component';
import { ContentDetailComponent } from './pages/content-detail/content-detail.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { ProfileComponent } from './pages/profile/profile.component';
import { SupabaseInterceptor } from './interceptors/supabase.interceptor';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SongsComponent,
    MessagesComponent,
    ActionSongsComponent,
    ShortMessagesComponent,
    EventsComponent,
    AnnouncementsComponent,
    FavoritesComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    NavbarComponent,
    SettingsComponent,
    ForgotPasswordComponent,
    SocialComponent,
    ContentDetailComponent,
    SafeUrlPipe,
    ProfileComponent,
    ResetPasswordComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SupabaseInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }