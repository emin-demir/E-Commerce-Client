import { NgxSpinnerService } from "ngx-spinner";

export class BaseComponent  {

  constructor(private spinner : NgxSpinnerService) { }

  showSpinner(time: number = 200){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, time);
  }

    hideSpinner(){
      this.spinner.hide();
  }


}
