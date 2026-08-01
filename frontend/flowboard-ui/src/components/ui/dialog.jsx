import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"


function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}


function DialogTrigger({
  asChild,
  children,
  ...props
}) {
  if (asChild && children) {
    return (
      <DialogPrimitive.Trigger
        data-slot="dialog-trigger"
        render={children}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}


function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}


function DialogClose({
  asChild,
  children,
  ...props
}) {
  if (asChild && children) {
    return (
      <DialogPrimitive.Close
        data-slot="dialog-close"
        render={children}
        {...props}
      />
    );
  }

  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}


function DialogOverlay({
  className,
  onPointerDown,
  onPointerUp,
  ...props
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/70 backdrop-blur-sm duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPointerUp?.(event);
      }}
      {...props}
    />
  );
}



function DialogContent({
  children,
  showCloseButton = true,
  onPointerDown,
  onPointerDownCapture,
  onPointerUp,
  onPointerUpCapture,
  onClick,
  onClickCapture,
  ...props
}) {

  return (

    <DialogPortal>

      <DialogOverlay />


      <DialogPrimitive.Popup

        data-slot="dialog-content"

        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 60,
          width: "min(100%, calc(100% - 2rem))",
          maxWidth: "min(100%, 28rem)",
        }}

        className={cn(

          "grid gap-4 rounded-xl bg-surface p-6 text-sm text-slate-900 border border-surface-strong shadow-xl duration-100 outline-none",

        )}

        onPointerDown={(event) => {
          event.stopPropagation();
          onPointerDown?.(event);
        }}
        onPointerDownCapture={(event) => {
          event.stopPropagation();
          onPointerDownCapture?.(event);
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          onPointerUp?.(event);
        }}
        onPointerUpCapture={(event) => {
          event.stopPropagation();
          onPointerUpCapture?.(event);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        onClickCapture={(event) => {
          event.stopPropagation();
          onClickCapture?.(event);
        }}
        {...props}

      >


        {children}



        {showCloseButton && (
          <DialogPrimitive.Close asChild data-slot="dialog-close">
            <button
              type="button"
              className="absolute top-3 right-3 text-muted-custom hover:text-slate-900"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </button>
          </DialogPrimitive.Close>
        )}



      </DialogPrimitive.Popup>


    </DialogPortal>

  );

}



function DialogHeader({
  className,
  ...props
}) {

  return (

    <div

      data-slot="dialog-header"

      className={cn(
        "flex flex-col gap-2",
        className
      )}

      {...props}

    />

  );

}



function DialogFooter({
  className,
  children,
  ...props
}) {

  return (

    <div

      data-slot="dialog-footer"

      className={cn(

        "flex flex-col-reverse gap-2 rounded-b-xl border-t border-surface-strong bg-surface p-4 sm:flex-row sm:justify-end",

        className

      )}

      {...props}

    >

      {children}

    </div>

  );

}



function DialogTitle({
  className,
  ...props
}) {

  return (

    <DialogPrimitive.Title

      data-slot="dialog-title"

      className={cn(
        "text-xl font-semibold text-slate-900",
        className
      )}

      {...props}

    />

  );

}



function DialogDescription({
  className,
  ...props
}) {

  return (

    <DialogPrimitive.Description

      data-slot="dialog-description"

      className={cn(
        "text-sm text-muted-custom",
        className
      )}

      {...props}

    />

  );

}



export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}