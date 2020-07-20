import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PostListComponent} from './post-list/post-list.component';
import {PostCreateComponent} from './post-create/post-create.component';
import {AuthGuardService} from '../auth/auth-guard.service';

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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class PostRoutingModule {
}
