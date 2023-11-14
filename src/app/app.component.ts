import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, Subscription, from, fromEvent } from 'rxjs';
import dataArticle from 'src/app/dataBase/dataArticle';
import { Article, Response } from './interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  articles: Article[] = [];


  ngOnInit(): void {
    this.fetchArticles().subscribe(res => this.articles = res.data.articles);
  }



  fetchArticles(): Observable<Response<{ articles: Article[] }>> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const data = {
          data: {
            articles: dataArticle.articles
          }
        }

        subscriber.next(data);
        subscriber.complete();
      }, 1000)
    })
  }

  searchByKeyword(): Observable<Response<{ articles: Article[] }>> {

    return fromEvent(document.querySelector('#searcher') as HTMLInputElement, 'input').pipe(
      debounceTime(750),
      map((event: Event) => (event.target as HTMLInputElement).value),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim() === '') {
          return new Observable<Response<{ articles: Article[] }>>((observer) => {
            observer.next({ data: { articles: dataArticle.articles } });
            observer.complete();
          });
        } else {

          const filteredArticles = dataArticle.articles.filter((article: Article) =>
            article.title.includes(term) || article.id.includes(term) || article.userId.includes(term)
          );
          return new Observable<Response<{ articles: Article[] }>>((observer) => {
            observer.next({ data: { articles: filteredArticles } });
            observer.complete();
          });
        }
      })
    );
  }

  search() {
    this.searchByKeyword().subscribe(res => this.articles = res.data.articles);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
