import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../admin/alertify.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { DialogOptions, DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToasterService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService : DialogService,
    private spinnerService: NgxSpinnerService
  ) {}
  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();

    for (const file of files) {
      const fileEntry = file.fileEntry as FileSystemFileEntry;

      fileEntry.file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data:FileUploadDialogState.Yes,
      
      afterClosed: ()=>{
        this.spinnerService.show()
      this.httpClientService
      .post(
        {
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ responseType: 'blob' }),
        },
        fileData
      )
      .subscribe(
        (data) => {
          const message: string = 'Dosyalar Başarı ile yüklenmiştir.';

          if (this.options.isAdminPage) {
            this.alertifyService.message(message, {
              dismissOthers: true,
              messageType: MessageType.success,
              position: Position.TopRight,
            });
          } else {
            this.customToasterService.message(message, 'Başarılı', {
              messageType: ToastrMessageType.success,
              position: ToastrPosition.TopRight,
            });
          }
          this.spinnerService.hide();
        },
        (errorResponse: HttpErrorResponse) => {
          const message: string = 'Dosyalar Yüklenemedi.';

          if (this.options.isAdminPage) {
            this.alertifyService.message(message, {
              dismissOthers: true,
              messageType: MessageType.error,
              position: Position.TopRight,
            });
          } else {
            this.customToasterService.message(message, 'Başaramadık Abi', {
              messageType: ToastrMessageType.error,
              position: ToastrPosition.TopRight,
            });
          }
          this.spinnerService.hide();
        }
      );
    }})


  }
  // Servis haline getirilmeden önceki kod
  // openDialog(afterClosed: any): void {
  //   const dialogRef = this.dialog.open(FileUploadDialogComponent, {
  //     width: '250px',
  //     data: FileUploadDialogState.Yes,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == FileUploadDialogState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }
}
export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
