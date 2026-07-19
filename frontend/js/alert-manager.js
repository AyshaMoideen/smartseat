/* ==========================================
   SMARTSEAT ALERT MANAGER
========================================== */

const AlertManager = {

    success(title,text=""){

        Swal.fire({

            icon:"success",

            title,

            text,

            timer:1800,

            showConfirmButton:false

        });

    },

    error(title,text=""){

        Swal.fire({

            icon:"error",

            title,

            text

        });

    },

    warning(title,text=""){

        Swal.fire({

            icon:"warning",

            title,

            text

        });

    },

    confirm(title,text=""){

        return Swal.fire({

            icon:"question",

            title,

            text,

            showCancelButton:true,

            confirmButtonText:"Yes",

            cancelButtonText:"Cancel",

            confirmButtonColor:"#0B2D5C",

            cancelButtonColor:"#EF4444"

        });

    }

};

console.log("Alert Manager Loaded");