import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  selectedSection = 'songs';

  // =====================================================
  // SONGS
  // =====================================================

  songs: any[] = [];

  showSongForm = false;
  editingSongId: string | null = null;

  newSong = {
    titleTelugu: '',
    titleEnglish: '',
    lyricsTelugu: '',
    lyricsEnglish: '',
    category: 'General',
    youtubeLink: ''
  };

  // =====================================================
  // MESSAGES
  // =====================================================

  messages: any[] = [];

  showMessageForm = false;
  editingMessageId: string | null = null;

  newMessage = {
    title: '',
    content: '',
    youtubeLink: '',
    category: 'General'
  };

  // =====================================================
  // SHORT MESSAGES
  // =====================================================

  shortMessages: any[] = [];

  showShortMessageForm = false;
  editingShortMessageId: string | null = null;

  newShortMessage = {
    title: '',
    content: '',
    youtubeLink: '',
    audioLink: '',
    category: 'General'
  };


  // =====================================================
  // ACTION SONGS
  // =====================================================

  actionSongs: any[] = [];

  showActionSongForm = false;
  editingActionSongId: string | null = null;

  newActionSong = {
    title: '',
    content: '',
    youtubeLink: '',
    audioLink: '',
    category: 'General'
  };


  // =====================================================
  // ANNOUNCEMENTS
  // =====================================================

  announcements: any[] = [];

  showAnnouncementForm = false;
  editingAnnouncementId: string | null = null;

  newAnnouncement = {
    title: '',
    content: '',
    dateTime: '',
    category: 'General'
  };


  // =====================================================
  // DAILY PROMISE
  // =====================================================

  dailyPromises: any[] = [];

  showDailyPromiseForm = false;
  editingDailyPromiseId: string | null = null;

  newDailyPromise = {
    date: '',
    reference: '',
    verse: '',
    note: ''
  };


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  notifications: any[] = [];

  showNotificationForm = false;
  editingNotificationId: string | null = null;

  newNotification = {
    title: '',
    message: '',
    date: '',
    time: '',
    repeat: 'Once',
    active: true
  };


  // =====================================================
  // SOCIAL CHANNELS
  // =====================================================

  socialChannels: any[] = [];

  showSocialForm = false;
  editingSocialId: string | null = null;

  newSocialChannel = {
    platform: '',
    name: '',
    url: ''
  };

  // =====================================================
  // USERS / ADMIN MANAGEMENT
  // =====================================================

  users: any[] = [];

  adminCount = 0;

  maxAdmins = 4;

  changeableAdmins = 3;

  permanentAdminEmail =
    'tallurimadhulika@gmail.com';

  usersLoading = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.getSongs();
    this.getMessages();
    this.getShortMessages();
    this.getActionSongs();
    this.getAnnouncements();
    this.getDailyPromises();
    this.getNotifications();
    this.getSocialChannels();
    this.getUsers();

  }


  // =====================================================
  // SONGS CRUD
  // =====================================================

  getSongs(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/songs'
      )
      .subscribe({

        next: (data) => {

          this.songs = data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching songs:',
            error
          );

        }

      });

  }


  openSongForm(): void {
    this.editingSongId = null;
    this.newSong = {
      titleTelugu: '',
      titleEnglish: '',
      lyricsTelugu: '',
      lyricsEnglish: '',
      category: 'General',
      youtubeLink: ''
    };
    this.showSongForm = true;
  }

  closeSongForm(): void {
    this.showSongForm = false;
    this.editingSongId = null;
    this.newSong = {
      titleTelugu: '',
      titleEnglish: '',
      lyricsTelugu: '',
      lyricsEnglish: '',
      category: 'General',
      youtubeLink: ''
    };
  }

  saveSong(): void {
    if (this.editingSongId) {
      this.http
        .put(
          `http://localhost:5000/api/songs/${this.editingSongId}`,
          this.newSong
        )
        .subscribe({
          next: () => {
            alert('Song updated successfully!');
            this.closeSongForm();
            this.getSongs();
          },
          error: (error) => {
            console.error('Error updating song:', error);
            alert('Error updating song:\n' + (error.error?.error || error.message || 'Unknown error'));
          }
        });
    } else {
      this.http
        .post(
          'http://localhost:5000/api/songs',
          this.newSong
        )
        .subscribe({
          next: () => {
            alert('Song added successfully!');
            this.closeSongForm();
            this.getSongs();
          },
          error: (error) => {
            console.error('Error adding song:', error);
            alert('Error adding song:\n' + (error.error?.error || error.message || 'Unknown error'));
          }
        });
    }
  }

  editSong(song: any): void {
    this.editingSongId = song._id;
    this.newSong = {
      titleTelugu: song.titleTelugu || '',
      titleEnglish: song.titleEnglish || '',
      lyricsTelugu: song.lyricsTelugu || '',
      lyricsEnglish: song.lyricsEnglish || '',
      category: song.category || 'General',
      youtubeLink: song.youtubeLink || ''
    };
    this.showSongForm = true;
  }


  deleteSong(id: string): void {

    if (
      confirm(
        'Are you sure you want to delete this song?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/songs/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Song deleted successfully!'
            );

            this.getSongs();

          },

          error: (error) => {

            console.error(
              'Error deleting song:',
              error
            );

          }

        });

    }

  }


  // =====================================================
  // MESSAGES CRUD
  // =====================================================

  getMessages(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/messages'
      )
      .subscribe({

        next: (data) => {

          this.messages = data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching messages:',
            error
          );

        }

      });

  }


  openMessageForm(): void {

    this.editingMessageId = null;

    this.newMessage = {
      title: '',
      content: '',
      youtubeLink: '',
      category: 'General'
    };

    this.showMessageForm = true;

  }


  closeMessageForm(): void {

    this.showMessageForm = false;

    this.editingMessageId = null;

    this.newMessage = {
      title: '',
      content: '',
      youtubeLink: '',
      category: 'General'
    };

  }


  saveMessage(): void {

    if (this.editingMessageId) {

      this.http
        .put(
          `http://localhost:5000/api/messages/${this.editingMessageId}`,
          this.newMessage
        )
        .subscribe({

          next: () => {

            alert(
              'Message updated successfully!'
            );

            this.closeMessageForm();

            this.getMessages();

          },

          error: (error) => {

            console.error(
              'Error updating message:',
              error
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/messages',
          this.newMessage
        )
        .subscribe({

          next: () => {

            alert(
              'Message added successfully!'
            );

            this.closeMessageForm();

            this.getMessages();

          },

          error: (error) => {

            console.error(
              'Error adding message:',
              error
            );

          }

        });

    }

  }


  editMessage(message: any): void {

    this.editingMessageId =
      message._id;

    this.newMessage = {

      title: message.title,

      content: message.content,

      youtubeLink:
        message.youtubeLink || '',

      category:
        message.category || 'General'

    };

    this.showMessageForm = true;

  }


  deleteMessage(id: string): void {

    if (
      confirm(
        'Are you sure you want to delete this message?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/messages/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Message deleted successfully!'
            );

            this.getMessages();

          },

          error: (error) => {

            console.error(
              'Error deleting message:',
              error
            );

          }

        });

    }

  }


  // =====================================================
  // SHORT MESSAGES CRUD
  // =====================================================

  getShortMessages(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/short-messages'
      )
      .subscribe({

        next: (data) => {

          this.shortMessages =
            data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching short messages:',
            error
          );

        }

      });

  }


  openShortMessageForm(): void {

    this.editingShortMessageId = null;

    this.newShortMessage = {

      title: '',

      content: '',

      youtubeLink: '',

      audioLink: '',

      category: 'General'

    };

    this.showShortMessageForm = true;

  }


  closeShortMessageForm(): void {

    this.showShortMessageForm = false;

    this.editingShortMessageId = null;

    this.newShortMessage = {

      title: '',

      content: '',

      youtubeLink: '',

      audioLink: '',

      category: 'General'

    };

  }


  saveShortMessage(): void {

    if (this.editingShortMessageId) {

      this.http
        .put(
          `http://localhost:5000/api/short-messages/${this.editingShortMessageId}`,
          this.newShortMessage
        )
        .subscribe({

          next: () => {

            alert(
              'Short message updated successfully!'
            );

            this.closeShortMessageForm();

            this.getShortMessages();

          },

          error: (error) => {

            console.error(
              'Error updating short message:',
              error
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/short-messages',
          this.newShortMessage
        )
        .subscribe({

          next: () => {

            alert(
              'Short message added successfully!'
            );

            this.closeShortMessageForm();

            this.getShortMessages();

          },

          error: (error) => {

            console.error(
              'Error adding short message:',
              error
            );

          }

        });

    }

  }


  editShortMessage(
    shortMessage: any
  ): void {

    this.editingShortMessageId =
      shortMessage._id;

    this.newShortMessage = {

      title:
        shortMessage.title,

      content:
        shortMessage.content,

      youtubeLink:
        shortMessage.youtubeLink || '',

      audioLink:
        shortMessage.audioLink || '',

      category:
        shortMessage.category ||
        'General'

    };

    this.showShortMessageForm = true;

  }


  deleteShortMessage(
    id: string
  ): void {

    if (
      confirm(
        'Are you sure you want to delete this short message?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/short-messages/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Short message deleted successfully!'
            );

            this.getShortMessages();

          },

          error: (error) => {

            console.error(
              'Error deleting short message:',
              error
            );

          }

        });

    }

  }


  // =====================================================
  // ACTION SONGS CRUD
  // =====================================================

  getActionSongs(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/action-songs'
      )
      .subscribe({

        next: (data) => {

          this.actionSongs =
            data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching action songs:',
            error
          );

        }

      });

  }


  openActionSongForm(): void {

    this.editingActionSongId = null;

    this.newActionSong = {

      title: '',

      content: '',

      youtubeLink: '',

      audioLink: '',

      category: 'General'

    };

    this.showActionSongForm = true;

  }


  closeActionSongForm(): void {

    this.showActionSongForm = false;

    this.editingActionSongId = null;

    this.newActionSong = {

      title: '',

      content: '',

      youtubeLink: '',

      audioLink: '',

      category: 'General'

    };

  }


  saveActionSong(): void {

    if (this.editingActionSongId) {

      this.http
        .put(
          `http://localhost:5000/api/action-songs/${this.editingActionSongId}`,
          this.newActionSong
        )
        .subscribe({

          next: () => {

            alert(
              'Action song updated successfully!'
            );

            this.closeActionSongForm();

            this.getActionSongs();

          },

          error: (error) => {

            console.error(
              'Error updating action song:',
              error
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/action-songs',
          this.newActionSong
        )
        .subscribe({

          next: () => {

            alert(
              'Action song added successfully!'
            );

            this.closeActionSongForm();

            this.getActionSongs();

          },

          error: (error) => {

            console.error(
              'Error adding action song:',
              error
            );

          }

        });

    }

  }


  editActionSong(
    actionSong: any
  ): void {

    this.editingActionSongId =
      actionSong._id;

    this.newActionSong = {

      title:
        actionSong.title,

      content:
        actionSong.content,

      youtubeLink:
        actionSong.youtubeLink || '',

      audioLink:
        actionSong.audioLink || '',

      category:
        actionSong.category ||
        'General'

    };

    this.showActionSongForm = true;

  }


  deleteActionSong(
    id: string
  ): void {

    if (
      confirm(
        'Are you sure you want to delete this action song?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/action-songs/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Action song deleted successfully!'
            );

            this.getActionSongs();

          },

          error: (error) => {

            console.error(
              'Error deleting action song:',
              error
            );

          }

        });

    }

  }


  // =====================================================
  // ANNOUNCEMENTS CRUD
  // =====================================================

  getAnnouncements(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/announcements'
      )
      .subscribe({

        next: (data) => {

          this.announcements =
            data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching announcements:',
            error
          );

        }

      });

  }


  openAnnouncementForm(): void {

    this.editingAnnouncementId = null;

    this.newAnnouncement = {

      title: '',

      content: '',

      dateTime: '',

      category: 'General'

    };

    this.showAnnouncementForm = true;

  }


  closeAnnouncementForm(): void {

    this.showAnnouncementForm = false;

    this.editingAnnouncementId = null;

    this.newAnnouncement = {

      title: '',

      content: '',

      dateTime: '',

      category: 'General'

    };

  }


  saveAnnouncement(): void {

    if (this.editingAnnouncementId) {

      this.http
        .put(
          `http://localhost:5000/api/announcements/${this.editingAnnouncementId}`,
          this.newAnnouncement
        )
        .subscribe({

          next: () => {

            alert(
              'Announcement updated successfully!'
            );

            this.closeAnnouncementForm();

            this.getAnnouncements();

          },

          error: (error) => {

            console.error(
              'Error updating announcement:',
              error
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/announcements',
          this.newAnnouncement
        )
        .subscribe({

          next: () => {

            alert(
              'Announcement added successfully!'
            );

            this.closeAnnouncementForm();

            this.getAnnouncements();

          },

          error: (error) => {

            console.error(
              'Error adding announcement:',
              error
            );

          }

        });

    }

  }


  editAnnouncement(
    announcement: any
  ): void {

    this.editingAnnouncementId =
      announcement._id;

    this.newAnnouncement = {

      title:
        announcement.title,

      content:
        announcement.content,

      dateTime:
        announcement.dateTime || '',

      category:
        announcement.category ||
        'General'

    };

    this.showAnnouncementForm = true;

  }


  deleteAnnouncement(
    id: string
  ): void {

    if (
      confirm(
        'Are you sure you want to delete this announcement?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/announcements/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Announcement deleted successfully!'
            );

            this.getAnnouncements();

          },

          error: (error) => {

            console.error(
              'Error deleting announcement:',
              error
            );

          }

        });

    }

  }


  // =====================================================
  // DAILY PROMISE CRUD
  // =====================================================

  getDailyPromises(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/daily-promises'
      )
      .subscribe({

        next: (data) => {

          this.dailyPromises =
            data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching daily promises:',
            error
          );

        }

      });

  }


  openDailyPromiseForm(): void {

    this.editingDailyPromiseId = null;

    this.newDailyPromise = {

      date: this.getLocalDate(),

      reference: '',

      verse: '',

      note: ''

    };

    this.showDailyPromiseForm = true;

  }


  closeDailyPromiseForm(): void {

    this.showDailyPromiseForm = false;

    this.editingDailyPromiseId = null;

    this.newDailyPromise = {

      date: '',

      reference: '',

      verse: '',

      note: ''

    };

  }


  saveDailyPromise(): void {

    if (
      !this.newDailyPromise.date ||
      !this.newDailyPromise.reference ||
      !this.newDailyPromise.verse
    ) {

      alert(
        'Please fill Date, Bible Reference and Verse.'
      );

      return;

    }


    if (this.editingDailyPromiseId) {

      this.http
        .put(
          `http://localhost:5000/api/daily-promises/${this.editingDailyPromiseId}`,
          this.newDailyPromise
        )
        .subscribe({

          next: () => {

            alert(
              'Daily Promise updated successfully!'
            );

            this.closeDailyPromiseForm();

            this.getDailyPromises();

          },

          error: (error) => {

            console.error(
              'Error updating daily promise:',
              error
            );

            alert(
              'Error updating Daily Promise.'
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/daily-promises',
          this.newDailyPromise
        )
        .subscribe({

          next: () => {

            alert(
              'Daily Promise added successfully!'
            );

            this.closeDailyPromiseForm();

            this.getDailyPromises();

          },

          error: (error) => {

            console.error(
              'Error adding daily promise:',
              error
            );

            alert(
              error.error?.message ||
              'Error adding Daily Promise.'
            );

          }

        });

    }

  }


  editDailyPromise(
    promise: any
  ): void {

    this.editingDailyPromiseId =
      promise._id;

    this.newDailyPromise = {

      date:
        promise.date || '',

      reference:
        promise.reference || '',

      verse:
        promise.verse || '',

      note:
        promise.note || ''

    };

    this.showDailyPromiseForm = true;

  }


  deleteDailyPromise(
    id: string
  ): void {

    if (
      confirm(
        'Are you sure you want to delete this Daily Promise?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/daily-promises/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Daily Promise deleted successfully!'
            );

            this.getDailyPromises();

          },

          error: (error) => {

            console.error(
              'Error deleting daily promise:',
              error
            );

          }

        });

    }

  }


  getLocalDate(): string {

    const now = new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        now.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =====================================================
  // NOTIFICATIONS CRUD
  // =====================================================

  getNotifications(): void {

    this.http
      .get<any[]>(
        'http://localhost:5000/api/notifications'
      )
      .subscribe({

        next: (data) => {

          this.notifications =
            data || [];

        },

        error: (error) => {

          console.error(
            'Error fetching notifications:',
            error
          );

        }

      });

  }


  openNotificationForm(): void {

    this.editingNotificationId = null;

    this.newNotification = {

      title: '',

      message: '',

      date: '',

      time: '',

      repeat: 'Once',

      active: true

    };

    this.showNotificationForm = true;

  }


  closeNotificationForm(): void {

    this.showNotificationForm = false;

    this.editingNotificationId = null;

    this.newNotification = {

      title: '',

      message: '',

      date: '',

      time: '',

      repeat: 'Once',

      active: true

    };

  }


  saveNotification(): void {

    if (
      !this.newNotification.title ||
      !this.newNotification.message ||
      !this.newNotification.date ||
      !this.newNotification.time
    ) {

      alert(
        'Please fill all notification fields.'
      );

      return;

    }


    if (this.editingNotificationId) {

      this.http
        .put(
          `http://localhost:5000/api/notifications/${this.editingNotificationId}`,
          this.newNotification
        )
        .subscribe({

          next: () => {

            alert(
              'Notification updated successfully!'
            );

            this.closeNotificationForm();

            this.getNotifications();

          },

          error: (error) => {

            console.error(
              'Error updating notification:',
              error
            );

            alert(
              'Error updating notification.'
            );

          }

        });

    } else {

      this.http
        .post(
          'http://localhost:5000/api/notifications',
          this.newNotification
        )
        .subscribe({

          next: () => {

            alert(
              'Notification added successfully!'
            );

            this.closeNotificationForm();

            this.getNotifications();

          },

          error: (error) => {

            console.error(
              'Error adding notification:',
              error
            );

            alert(
              'Error adding notification.'
            );

          }

        });

    }

  }


  editNotification(
    notification: any
  ): void {

    this.editingNotificationId =
      notification._id;

    this.newNotification = {

      title:
        notification.title,

      message:
        notification.message,

      date:
        notification.date,

      time:
        notification.time,

      repeat:
        notification.repeat ||
        'Once',

      active:
        notification.active !== false

    };

    this.showNotificationForm = true;

  }


  deleteNotification(
    id: string
  ): void {

    if (
      confirm(
        'Are you sure you want to delete this notification?'
      )
    ) {

      this.http
        .delete(
          `http://localhost:5000/api/notifications/${id}`
        )
        .subscribe({

          next: () => {

            alert(
              'Notification deleted successfully!'
            );

            this.getNotifications();

          },

          error: (error) => {

            console.error(
              'Error deleting notification:',
              error
            );

            alert(
              'Error deleting notification.'
            );

          }

        });

    }

  }


  // =====================================================
  // USERS / ADMIN MANAGEMENT
  // =====================================================

  private getAuthHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');

    return new HttpHeaders({

      Authorization:
        `Bearer ${token || ''}`

    });

  }


  getUsers(): void {

    this.usersLoading = true;

    this.http
      .get<any>(
        'http://localhost:5000/api/auth/users',
        {
          headers:
            this.getAuthHeaders()
        }
      )
      .subscribe({

        next: (response) => {

          this.users =
            response.users || [];

          this.adminCount =
            response.adminCount || 0;

          this.maxAdmins =
            response.maxAdmins || 4;

          this.changeableAdmins =
            response.changeableAdmins || 3;

          this.permanentAdminEmail =
            response.permanentAdminEmail ||
            'tallurimadhulika@gmail.com';

          this.usersLoading = false;

        },

        error: (error) => {

          console.error(
            'Error loading users:',
            error
          );

          this.usersLoading = false;

        }

      });

  }


  makeAdmin(user: any): void {

    if (!user?._id) {
      return;
    }


    if (
      this.adminCount >=
      this.maxAdmins
    ) {

      alert(
        'Maximum 4 admins are already assigned.'
      );

      return;

    }


    if (
      !confirm(
        `Make ${user.name} an admin?`
      )
    ) {

      return;

    }


    this.http
      .put(
        `http://localhost:5000/api/auth/users/${user._id}/make-admin`,
        {},
        {
          headers:
            this.getAuthHeaders()
        }
      )
      .subscribe({

        next: (response: any) => {

          alert(
            response.message ||
            `${user.name} is now an admin.`
          );

          this.getUsers();

        },

        error: (error) => {

          console.error(
            'Make Admin Error:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to make user admin.'
          );

        }

      });

  }


  removeAdmin(user: any): void {

    if (!user?._id) {
      return;
    }


    if (user.isPermanent) {

      alert(
        'The permanent admin cannot be removed.'
      );

      return;

    }


    if (
      !confirm(
        `Remove admin access from ${user.name}?`
      )
    ) {

      return;

    }


    this.http
      .put(
        `http://localhost:5000/api/auth/users/${user._id}/remove-admin`,
        {},
        {
          headers:
            this.getAuthHeaders()
        }
      )
      .subscribe({

        next: (response: any) => {

          alert(
            response.message ||
            'Admin access removed.'
          );

          this.getUsers();

        },

        error: (error) => {

          console.error(
            'Remove Admin Error:',
            error
          );

          alert(
            error.error?.message ||
            'Unable to remove admin.'
          );

        }

      });

  }


  getUserInitial(
    user: any
  ): string {

    const name =
      user?.name ||
      user?.email ||
      'J';

    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  getUserAvatarGradient(
    user: any
  ): string {

    const name =
      user?.name ||
      user?.email ||
      'JCPM';

    let total = 0;


    for (
      let i = 0;
      i < name.length;
      i++
    ) {

      total +=
        name.charCodeAt(i);

    }


    const gradients = [

      'linear-gradient(135deg, #8e7dff, #c4b5fd)',

      'linear-gradient(135deg, #ff7eb3, #ffb6d5)',

      'linear-gradient(135deg, #5bbcff, #9ddcff)',

      'linear-gradient(135deg, #62d9a8, #a8efd0)',

      'linear-gradient(135deg, #ff9f68, #ffd0ad)',

      'linear-gradient(135deg, #9b8cff, #e0aaff)',

      'linear-gradient(135deg, #55c7c0, #9de9e4)',

      'linear-gradient(135deg, #f28bb3, #ffc1d6)'

    ];


    return gradients[
      total % gradients.length
    ];

  }

  // =====================================================
  // SOCIAL CHANNELS CRUD
  // =====================================================

  getSocialChannels(): void {
    this.http.get<any[]>('http://localhost:5000/api/social-channels')
      .subscribe({
        next: (data) => {
          this.socialChannels = data || [];
        },
        error: (error) => {
          console.error('Error fetching social channels:', error);
        }
      });
  }

  openSocialForm(): void {
    this.editingSocialId = null;
    this.newSocialChannel = {
      platform: '',
      name: '',
      url: ''
    };
    this.showSocialForm = true;
  }

  closeSocialForm(): void {
    this.showSocialForm = false;
    this.editingSocialId = null;
    this.newSocialChannel = {
      platform: '',
      name: '',
      url: ''
    };
  }

  saveSocialChannel(): void {
    const payload = {
      ...this.newSocialChannel,
      icon: this.newSocialChannel.platform.toLowerCase()
    };

    if (this.editingSocialId) {
      this.http.put(`http://localhost:5000/api/social-channels/${this.editingSocialId}`, payload)
        .subscribe({
          next: () => {
            alert('Social channel updated successfully!');
            this.closeSocialForm();
            this.getSocialChannels();
          },
          error: (error) => {
            console.error('Error updating social channel:', error);
            alert('Error updating social channel: ' + (error.error?.message || error.message));
          }
        });
    } else {
      this.http.post('http://localhost:5000/api/social-channels', payload)
        .subscribe({
          next: () => {
            alert('Social channel added successfully!');
            this.closeSocialForm();
            this.getSocialChannels();
          },
          error: (error) => {
            console.error('Error adding social channel:', error);
            alert('Error adding social channel: ' + (error.error?.message || error.message));
          }
        });
    }
  }

  editSocialChannel(channel: any): void {
    this.editingSocialId = channel._id || channel.id;
    this.newSocialChannel = {
      platform: channel.platform || channel.icon || '',
      name: channel.name || '',
      url: channel.url || channel.link || ''
    };
    this.showSocialForm = true;
  }

  deleteSocialChannel(id: string): void {
    if (confirm('Are you sure you want to delete this social channel?')) {
      this.http.delete(`http://localhost:5000/api/social-channels/${id}`)
        .subscribe({
          next: () => {
            alert('Social channel deleted successfully!');
            this.getSocialChannels();
          },
          error: (error) => {
            console.error('Error deleting social channel:', error);
          }
        });
    }
  }

}