import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit, OnDestroy {
  public pageTitle = 'User detail:';
  public user: User;
  public userForm: FormGroup;
  private userId: number;
  private routeSubscription: Subscription;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.routeSubscription = this.route.params.subscribe(
      pars => (this.userId = +pars['id'])
    );
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      isDeleted: [false, [Validators.required]]
    });

    this.userService.getUser(this.userId)
    .subscribe(u => {
      this.user = u;
      this.userForm = this.formBuilder.group({
        id: [this.user.id, [Validators.required]],
        fname: [this.user.fname, [Validators.required]],
        lname: [this.user.lname, [Validators.required]],
        isDeleted: [this.user.isDeleted, [Validators.required]]
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  public onBack() {
    this.router.navigate(['/users']);
  }

  public submit() {
    const u: User = Object.assign({}, this.userForm.value);
    const b = this.userService.update(u);
    if (b) {
      this.userForm.reset();
    }
    this.onBack();
  }

}
