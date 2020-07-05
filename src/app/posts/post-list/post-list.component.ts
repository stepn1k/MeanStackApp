import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../post.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;
  isLoading = false;

  pageSize = 5;
  currentPage = 1;
  postsLength;

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.pageSize);
    this.postsSub = this.postService.postsChanged
      .subscribe((data: { posts: Post[], count: number }) => {
        this.posts = data.posts;
        this.postsLength = data.count;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(
      () => {
        this.postService.getPosts(this.currentPage, this.pageSize);
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
