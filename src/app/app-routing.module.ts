import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './auth/auth-guard.service';

const routes: Routes = [
    {
      path: '', loadChildren: () => import('./posts/post.module')
        .then(m => m.PostModule)
    },

    {
      path: 'auth', loadChildren: () => import('./auth/auth.module')
        .then(m => m.AuthModule)
    }
  ]
;

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule {
}
