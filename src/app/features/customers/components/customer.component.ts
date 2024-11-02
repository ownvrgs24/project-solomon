import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnDestroy {
  private readonly userService = inject(UserService);
  
  ngOnDestroy(): void {

    this.userService.removeLocalStorage('customerListPage');
    this.userService.removeLocalStorage('customerListRows');

  }
}
