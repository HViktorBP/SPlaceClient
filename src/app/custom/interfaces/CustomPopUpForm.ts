import {OnDestroy, OnInit} from "@angular/core";

/**
 * CustomPopUpForm defines the necessary methods that pop-up, that contains form, should complete
 */
export interface CustomPopUpForm extends OnInit, OnDestroy {
  onSubmit() : void;
}
