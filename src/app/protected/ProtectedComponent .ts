import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protected.component.html',
})
export class ProtectedComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProtectedResource().subscribe(response => {
      this.data = response;
    });
  }
}
