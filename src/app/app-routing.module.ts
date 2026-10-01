import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';

import { AdminGuard } from './guards/admin.guard';
import { ContentDetailComponent } from './pages/content-detail/content-detail.component';
import { HomeComponent } from './pages/home/home.component';
import { SocialComponent } from './pages/social/social.component';
import { SongsComponent } from './pages/songs/songs.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ActionSongsComponent } from './pages/action-songs/action-songs.component';
import { ShortMessagesComponent } from './pages/short-messages/short-messages.component';
import { EventsComponent } from './pages/events/events.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
  path: 'content-detail',
  component: ContentDetailComponent
},
  { path: '', component: HomeComponent },
  { path: 'social', component: SocialComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'messages', component: MessagesComponent },

  { path: 'action-songs', component: ActionSongsComponent },

  { path: 'short-messages', component: ShortMessagesComponent },

  { path: 'events', component: EventsComponent },

  { path: 'announcements', component: AnnouncementsComponent },

  { path: 'favorites', component: FavoritesComponent },

  { path: 'login', component: LoginComponent },

  { path: 'signup', component: SignupComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'reset-password', component: ResetPasswordComponent },

  { 
    path: 'admin', 
    component: DashboardComponent, 
    canActivate: [AdminGuard] 
  },

  { path: 'settings', component: SettingsComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}