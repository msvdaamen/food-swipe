import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core';

export class DialogComponent<D = unknown> {
  protected readonly dialogRef = inject(DialogRef);
  protected readonly data = inject<D>(DIALOG_DATA);

  /**
   * Closes the dialog without passing a result.
   */
  public dismiss(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog, passing a result.
   */
  public close<T>(data?: T): void {
    this.dialogRef.close(data);
  }
}
