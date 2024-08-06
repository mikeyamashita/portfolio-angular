import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogTitle, MatDialogModule } from '@angular/material/dialog';
import { User } from './model/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButton,
    MatDialogModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {

  testuser: User = new User();

  constructor(private authService: AuthService) {
    this.testuser.Email = "Mike@mikey.com";
    this.testuser.Password = "Mike1!";
  }

}
