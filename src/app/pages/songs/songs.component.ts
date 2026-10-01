import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  songs: any[] = [];
  filteredSongs: any[] = [];
  searchText = '';
  
  englishAlphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  teluguAlphabet: string[] = 'అ,ఆ,ఇ,ఈ,ఉ,ఊ,ఋ,ఎ,ఏ,ఐ,ఒ,ఓ,ఔ,అం,అః,క,ఖ,గ,ఘ,చ,ఛ,జ,ఝ,ట,ఠ,డ,ఢ,ణ,త,థ,ద,ధ,న,ప,ఫ,బ,భ,మ,య,ర,ల,వ,శ,ష,స,హ,ళ,క్ష,ఱ'.split(',');
  
  currentLanguage: 'EN' | 'TE' = 'EN';
  selectedLetter: string | null = null;

  get alphabet(): string[] {
    return this.currentLanguage === 'EN' ? this.englishAlphabet : this.teluguAlphabet;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.http.get<any[]>('http://localhost:5000/api/songs')
      .subscribe({
        next: (data) => {
          this.songs = (data || []).sort((a: any, b: any) => {
            const titleA = a.titleEnglish || a.titleTelugu || '';
            const titleB = b.titleEnglish || b.titleTelugu || '';
            return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
          });
          this.filteredSongs = this.songs;
        },
        error: (error) => {
          console.error('Error loading songs:', error);
          this.songs = [];
          this.filteredSongs = [];
        }
      });
  }

  searchSongs(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredSongs = this.songs.filter(song => {
      let matchesSearch = true;
      if (search) {
        matchesSearch = (song.titleEnglish || '').toLowerCase().includes(search) ||
                        (song.titleTelugu || '').toLowerCase().includes(search) ||
                        (song.category || '').toLowerCase().includes(search);
      }

      let matchesLetter = true;
      if (this.selectedLetter) {
        if (this.currentLanguage === 'EN') {
          const firstLetter = (song.titleEnglish || '').charAt(0).toUpperCase();
          matchesLetter = firstLetter === this.selectedLetter;
        } else {
          // Telugu character check
          // In Telugu, a syllable might be multiple JS characters, but for a simple starting letter filter, checking if it starts with the selected letter is more reliable.
          const titleTe = (song.titleTelugu || '').trim();
          matchesLetter = titleTe.startsWith(this.selectedLetter);
        }
      }

      return matchesSearch && matchesLetter;
    });
  }

  filterByLetter(letter: string): void {
    if (this.selectedLetter === letter) {
      this.selectedLetter = null;
    } else {
      this.selectedLetter = letter;
    }
    this.searchSongs();
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'EN' ? 'TE' : 'EN';
    this.selectedLetter = null; // Reset selection on language change
    this.searchSongs();
  }

  openSong(item: any): void {
    const id = item?._id || item?.id;

    if (!id) {
      return;
    }

    this.router.navigate(['/content-detail'], {
      queryParams: {
        type: 'songs',
        id: id,
        from: '/songs'
      }
    });
  }

  toggleFavorite(item: any, event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(item, 'songs');
  }

  isFavorite(item: any): boolean {
    const id = item?._id || item?.id;

    if (!id) {
      return false;
    }

    return this.favoriteService.isFavorite(id, 'songs');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}