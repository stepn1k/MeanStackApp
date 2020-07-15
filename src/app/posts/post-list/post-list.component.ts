import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  userId: string;
  isLoading = false;
  private authStateSub: Subscription;
  isAuthentication = false;

  pageSize = 5;
  currentPage = 1;
  postsLength;

  constructor(private postService: PostService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.pageSize);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.postsChanged
      .subscribe((data: { posts: Post[], count: number }) => {
        this.posts = data.posts;
        this.postsLength = data.count;
        this.isLoading = false;
      });
    this.isAuthentication = this.authService.authStatusListener.getValue();
    this.authStateSub = this.authService.authStatusListener.subscribe(
      isAuthentication => {
        this.isAuthentication = isAuthentication;
        this.userId = this.authService.getUserId();
      }
    );
  }

  ngOnDestroy(): void {
    this.authStateSub.unsubscribe();
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(
      () => {
        this.postService.getPosts(this.currentPage, this.pageSize);
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  onPageChanged(pageSettings: PageEvent) {
    this.isLoading = true;
    this.pageSize = pageSettings.pageSize;
    this.currentPage = pageSettings.pageIndex + 1;
    this.postService.getPosts(this.currentPage, this.pageSize);
  }

}
