import {OnDestroy, OnInit} from "@angular/core";

export interface CustomPopUpForm extends OnInit, OnDestroy {
  isLoading : boolean;

  onSubmit() : void;
}
