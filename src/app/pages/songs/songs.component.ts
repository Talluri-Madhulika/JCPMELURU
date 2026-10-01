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
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string | null = null;

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
        const firstLetter = (song.titleEnglish || '').charAt(0).toUpperCase();
        matchesLetter = firstLetter === this.selectedLetter;
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