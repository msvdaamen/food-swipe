import {DIALOG_DATA, DialogRef} from "@angular/cdk/dialog";
import {inject} from "@angular/core";


export class DialogComponent<R = unknown, D = unknown> {

  protected readonly dialogRef = inject<DialogRef<R>>(DialogRef);
  protected readonly data = inject<D>(DIALOG_DATA);

  /**
   * Gets the data passed into the dialog.
   */
  protected get<K extends keyof D>(key: K) {
    return this.data[key];
  }

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
