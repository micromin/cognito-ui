import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.user = this.storageService.get('user');
  }

}
