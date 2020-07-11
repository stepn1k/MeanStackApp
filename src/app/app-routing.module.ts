import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PostListComponent} from './posts/post-list/post-list.component';
import {PostCreateComponent} from './posts/post-create/post-create.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuardService} from './auth/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: PostListComponent
  },
  {
    path: 'create', component: PostCreateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'edit/:postId', component: PostCreateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'auth', component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {
}
