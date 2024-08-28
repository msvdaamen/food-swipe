import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core';

export class DialogComponent<R = unknown> {
  protected readonly dialogRef = inject<DialogRef<R>>(DialogRef);
  protected readonly data = inject(DIALOG_DATA);

  /**
   * Closes the dialog without passing a result.
   */
  public dismiss(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog, passing a result.
   */
  public close(data?: R): void {
    this.dialogRef.close(data);
  }
}
