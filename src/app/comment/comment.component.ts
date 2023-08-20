import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  @ViewChild('contentEditableDiv', { static: true })
  contentEditableDiv!: ElementRef;
  comments: string[] = [];
  users = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
  ];
  usersPosition = { left: 0, top: 0 };
  showUsers: boolean = false;
  currentTextRange: any = {};
  currentTextPosition = 0;
  alerts: any = [];

  onKeyDown(event: any) {
    const selection = window.getSelection();
    this.currentTextRange = selection?.getRangeAt(0);
    if (event.key === '@') {
      // Timeout required to prevent grabbing previous position
      setTimeout(() => {
        if (selection) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect) {
            this.usersPosition = { left: rect.left, top: rect.top };
          }
        }
        this.showUsers = true;
      }, 0);
    }
    // else if (event.key === 'Backspace') {
    // TODO need a way to remove the tag when backspacing....
    // }
    else {
      this.showUsers = false;
    }
  }

  addComment() {
    const content = this.contentEditableDiv.nativeElement.innerHTML.trim();
    if (content) {
      this.comments.push(content);
      this.contentEditableDiv.nativeElement.innerHTML = '';
    }
    // Fire alert for all tagged users
    if (this.alerts) {
      this.alerts.forEach((u: { name: string }) => {
        alert(u.name);
      });
    }
    this.alerts = [];
  }

  userClicked(user: any) {
    // Replace the '@' with the marked up mention
    const comment = `<strong>@${user.name}</strong>`;
    this.contentEditableDiv.nativeElement.innerHTML =
      this.contentEditableDiv.nativeElement.innerHTML.slice(0, -5) +
      comment +
      '&nbsp';
    this.showUsers = false;
    this.alerts.push(user);
    this.refocusToEnd();
  }

  refocusToEnd() {
    // Refocus caret on last char to continue typing
    const range = document.createRange();
    const lastChild = this.contentEditableDiv.nativeElement.lastChild;
    if (lastChild) {
      range.selectNodeContents(lastChild);
      range.collapse(false);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}
