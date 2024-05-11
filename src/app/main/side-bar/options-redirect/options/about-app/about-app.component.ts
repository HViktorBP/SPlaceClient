import { Component } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-about-app',
  standalone: true,
  imports: [],
  templateUrl: './about-app.component.html',
  styleUrl: './about-app.component.css'
})
export class AboutAppComponent {
  closeResult : string = ''
  constructor(private modalService: NgbModal) {
  }
  onAboutApp(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-4', size:"lg"}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
