/* ──────────────────────────────────────────────────────────────
   Novo Admin — configuración de la sección QRs
   ──────────────────────────────────────────────────────────────
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE TOCAR cuando la migración
   de la base de datos quede aplicada. Las páginas no traen ningún
   nombre de función escrito por dentro.

   FUENTE DE VERDAD de los nombres y los campos de aquí abajo
   (repo grupodigitia-source/novo-admin, rama cc/aviso-privacidad):
     supabase/migrations/20261123_registro_qr_pacientes.sql
     supabase/migrations/20261127_aviso_privacidad_consultorio.sql
     src/lib/registroQr.ts
   Nada en este archivo es inventado: todo sale de esos tres.

   Qué falta (Patricio):
     1. supabase.url y supabase.anonKey
     2. Aplicar las dos migraciones en producción
     3. Que cada consultorio llene su aviso en registro_qr_config
        (aviso_responsable, aviso_domicilio, aviso_correo_arco,
        aviso_version, aviso_fecha). Sin aviso completo, la función
        de la base rechaza los envíos a propósito.
     4. Poner flags.formularioActivo = true
     5. Poner flags.mostrarQRsEnMenu = true para enlazar la sección
        desde el menú del sitio
   ────────────────────────────────────────────────────────────── */

window.NOVO_CONFIG = {

  /* 1 · Conexión ------------------------------------------------ */
  supabase: {
    url: '',      // PENDIENTE — ej. https://xxxxxxxx.supabase.co
    anonKey: ''   // PENDIENTE — la anon key (pública) del proyecto
  },

  /* 2 · Funciones de la base ------------------------------------- */
  rpc: {
    // Público (anon). Devuelve una LISTA. Lista vacía = token
    // inválido o inactivo. Campos: nombre, logo_url, secciones, aviso.
    // nombre y logo_url vienen en null si el dueño no activó la marca.
    marca: 'marca_registro_qr',

    // Público (anon). Guarda el prerregistro y regresa void (204).
    // NO escribe en pacientes: recepción confirma desde la app.
    enviarPrerregistro: 'enviar_prerregistro_qr',

    // Solo el dueño con sesión. Firma: (p_business_id uuid,
    // p_rotar boolean default false). El panel del sitio todavía no
    // sabe de dónde saca el business_id — ver PR.
    tokenDelDueno: 'token_registro_qr'
  },

  /* 3 · Nombres de los argumentos de las funciones --------------- */
  args: {
    token: 'p_token',
    payload: 'p_payload',
    consentimiento: 'p_consentimiento',
    avisoVersion: 'p_aviso_version',
    trampa: 'p_trampa',
    aceptaPromociones: 'p_acepta_promociones',
    businessId: 'p_business_id',
    rotar: 'p_rotar'
  },

  /* 4 · Claves del payload (jsonb) ------------------------------- */
  // Las lee la app en src/lib/registroQr.ts (validarRegistro). El
  // payload es ANIDADO: los grupos salud, emergencia, seguro,
  // datos_fiscales, extras y responsable son objetos.
  payload: {
    plano: {
      nombres: 'nombres',
      apellidoPaterno: 'apellido_paterno',
      apellidoMaterno: 'apellido_materno',
      sinApellidoMaterno: 'sin_apellido_materno',
      fechaNacimiento: 'fecha_nacimiento',
      sexo: 'sexo',                       // 'F' | 'M' | 'X'
      celular: 'celular',                 // 10 dígitos
      correo: 'correo',
      codigoPostal: 'codigo_postal',       // 5 dígitos
      recordatorio: 'recordatorio',        // whatsapp | sms | correo | llamada
      tipoSangre: 'tipo_sangre',           // A+ A- B+ B- AB+ AB- O+ O- no_se
      embarazoLactancia: 'embarazo_lactancia' // no | embarazo | lactancia
    },
    grupos: {
      responsable: 'responsable',          // { nombre, telefono }
      salud: 'salud',                      // { alergias, padecimientos, medicamentos, cirugias, antecedentes_familiares }
      emergencia: 'emergencia',            // { nombre, telefono }
      seguro: 'seguro',                    // { tiene, aseguradora, poliza, titular, siniestro_abierto }
      datosFiscales: 'datos_fiscales',     // { rfc, razon_social, regimen_fiscal, codigo_postal, uso_cfdi, correo }
      extras: 'extras'                     // { motivo, como_nos_conocio, medico_refiere }
    }
  },

  /* 5 · Aviso de privacidad -------------------------------------- */
  // El texto, el responsable, el domicilio, el correo ARCO, la
  // versión y la fecha los publica CADA consultorio y llegan en
  // marca_registro_qr. El sitio no guarda ninguna versión propia.
  aviso: {
    // Mientras la versión del consultorio empiece con esto, el
    // formulario muestra la etiqueta "Texto provisional".
    prefijoBorrador: 'v1-borrador'
  },

  /* 6 · Secciones del formulario --------------------------------- */
  // Las manda marca_registro_qr (columna registro_qr_config.secciones).
  // Esto es solo el respaldo si la llamada falla; son los mismos
  // valores por defecto que la migración.
  seccionesPorDefecto: {
    salud: true,
    seguro: false,
    factura: false,
    emergencia: true,
    embarazo: false,
    extras: true
  },

  /* 7 · Interruptores -------------------------------------------- */
  flags: {
    // false = el formulario NO envía ni consulta nada y avisa que
    // aún no está activo. Ponerlo en true solo cuando las dos
    // migraciones estén aplicadas en producción.
    formularioActivo: false,

    // false = la sección QRs no aparece en el menú del sitio.
    // Sigue siendo accesible entrando directo a /qrs/.
    mostrarQRsEnMenu: false
  },

  /* 8 · Textos de error (en español, para el paciente) -----------
     Los que corresponden a un error de la base están copiados de
     mensajeErrorRegistro() en src/lib/registroQr.ts, para que el
     sitio y la app digan exactamente lo mismo. */
  errores: {
    // Antes de empezar
    tokenFaltante: 'Falta el código del consultorio. Vuelve a escanear el QR.',
    tokenInvalido: 'Este código QR no es válido. Pide uno nuevo en recepción.',
    sinAviso: 'Este consultorio aún no puede recibir registros en línea. Avisa en recepción.',

    // Validación en la página (mismas reglas que la función)
    nombreInvalido: 'Escribe tu nombre.',
    apellidoInvalido: 'Escribe tu apellido paterno.',
    apellidoMaternoInvalido: 'Escribe tu apellido materno o marca "No tengo".',
    fechaInvalida: 'Revisa la fecha de nacimiento.',
    sexoInvalido: 'Elige el sexo.',
    telefonoInvalido: 'El celular debe tener 10 dígitos.',
    correoInvalido: 'Revisa el correo.',
    cpInvalido: 'El código postal debe tener 5 dígitos.',
    responsableNombreFaltante: 'Escribe el nombre de la persona responsable.',
    responsableTelefonoInvalido: 'El teléfono de la persona responsable debe tener 10 dígitos.',
    telefonoEmergenciaInvalido: 'El teléfono de emergencia debe tener 10 dígitos.',
    rfcInvalido: 'Revisa el RFC.',
    razonSocialFaltante: 'Escribe el nombre o razón social como en tu constancia.',
    regimenInvalido: 'El régimen fiscal son 3 dígitos (por ejemplo 605).',
    cpFiscalInvalido: 'El C.P. fiscal debe tener 5 dígitos.',
    correoFacturaInvalido: 'Revisa el correo para la factura.',
    consentimientoFaltante: 'Para enviar, marca la casilla de consentimiento del aviso de privacidad.',

    // Respuestas de la base, por código
    db: {
      token_invalido: 'Este código QR ya no está activo. Pide uno nuevo en recepción.',
      aviso_no_configurado: 'Este consultorio aún no publica su aviso de privacidad. Regístrate en recepción.',
      sin_consentimiento: 'Para enviar, acepta el aviso de privacidad.',
      nombre_invalido: 'Revisa tu nombre y apellidos.',
      celular_invalido: 'El celular debe tener 10 dígitos.',
      correo_invalido: 'Revisa el correo.',
      sexo_invalido: 'Elige el sexo.',
      fecha_invalida: 'Revisa la fecha de nacimiento.',
      payload_invalido: 'El formulario es demasiado largo. Acorta los textos.',
      limite_excedido: 'Se alcanzó el límite de registros por hora con este código. Intenta más tarde o regístrate en recepción.'
    },
    // La función todavía no existe en la base (PGRST202 / 42883)
    noActivo: 'El registro aún no está disponible. Avisa en recepción.',
    // Cualquier otra cosa: red, 4xx, 5xx
    envioFallido: 'No se pudo enviar tu registro. Intenta de nuevo.'
  }
};
