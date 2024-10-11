import {Injectable} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor(
    private modalService : NgbModal,
  ) { }

  openModal(content: any) {
    return this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result;
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  dismissThePopup() {
    this.modalService.dismissAll()
  }
}
