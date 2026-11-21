/* ──────────────────────────────────────────────────────────────
   Novo Admin — configuración de la sección QRs
   ──────────────────────────────────────────────────────────────
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE TOCAR cuando la migración
   de la base de datos quede aprobada. Las páginas no traen ningún
   nombre de función ni de columna escrito por dentro.

   Qué falta (Patricio):
     1. supabase.url y supabase.anonKey
     2. Confirmar los nombres de rpc.* y campos.* contra la migración
     3. Poner flags.formularioActivo = true cuando las migraciones
        estén aplicadas en producción
     4. Poner flags.mostrarQRsEnMenu = true para enlazar la sección
        desde el menú del sitio
   ────────────────────────────────────────────────────────────── */

window.NOVO_CONFIG = {

  /* 1 · Conexión ------------------------------------------------ */
  supabase: {
    url: '',      // PENDIENTE — ej. https://xxxxxxxx.supabase.co
    anonKey: ''   // PENDIENTE — la anon key (pública) del proyecto
  },

  /* 2 · Nombres de las funciones (los define la migración) ------- */
  rpc: {
    // Guarda la respuesta del paciente como prerregistro.
    // El PR #28 usaba "registrar_paciente_qr"; confirmar.
    registrarPrerregistro: 'registrar_prerregistro_qr',

    // Devuelve SOLO el nombre y el logo del consultorio, y solo si
    // el dueño activó mostrarlos. Nunca devuelve el business_id.
    consultorioPublico: 'consultorio_publico_por_token',

    // Panel del dueño: su token y cuántos prerregistros tiene.
    qrDelDueno: 'qr_del_dueno'
  },

  /* 3 · Nombres de los campos del payload ------------------------ */
  // izquierda = como lo llama el sitio · derecha = como lo espera la
  // función de la base de datos. Cambiar solo la derecha.
  campos: {
    token: 'p_token',
    payload: 'p_payload',
    consentimiento: 'p_consentimiento',
    avisoVersion: 'p_aviso_version',

    nombres: 'nombres',
    apellidoPaterno: 'apellido_paterno',
    apellidoMaterno: 'apellido_materno',
    sinApellidoMaterno: 'sin_apellido_materno',
    fechaNacimiento: 'fecha_nacimiento',
    sexo: 'sexo',
    celular: 'celular',
    correo: 'correo',
    codigoPostal: 'codigo_postal',
    recordatorios: 'preferencia_recordatorios',

    responsableNombre: 'responsable_nombre',
    responsableTelefono: 'responsable_telefono',

    tipoSangre: 'tipo_sangre',
    alergias: 'alergias',
    enfermedades: 'enfermedades',
    medicamentos: 'medicamentos',
    cirugias: 'cirugias',
    antecedentesFamiliares: 'antecedentes_familiares',
    embarazoLactancia: 'embarazo_lactancia',

    emergenciaNombre: 'emergencia_nombre',
    emergenciaParentesco: 'emergencia_parentesco',
    emergenciaTelefono: 'emergencia_telefono',

    tieneSeguro: 'tiene_seguro',
    aseguradora: 'aseguradora',
    poliza: 'poliza',
    titularPoliza: 'titular_poliza',
    siniestroAbierto: 'siniestro_abierto',

    necesitaFactura: 'necesita_factura',
    rfc: 'rfc',
    razonSocial: 'razon_social',
    regimenFiscal: 'regimen_fiscal',
    cpFiscal: 'cp_fiscal',
    usoCfdi: 'uso_cfdi',
    correoFactura: 'correo_factura',

    motivoConsulta: 'motivo_consulta',
    comoNosConociste: 'como_nos_conociste',
    medicoRefiere: 'medico_refiere'
  },

  /* 4 · Aviso de privacidad -------------------------------------- */
  aviso: {
    version: '0.1-borrador',
    aprobado: false   // mientras sea false, el formulario muestra la
                      // etiqueta "pendiente de aprobación"
  },

  /* 5 · Secciones que trae el formulario ------------------------- */
  // Valores por defecto mientras el panel (Fase 2) no las guarde.
  seccionesPorDefecto: {
    salud: true,
    seguro: true,
    factura: false,
    emergencia: true,
    embarazoLactancia: false,
    mostrarIdentidad: true
  },

  /* 6 · Interruptores -------------------------------------------- */
  flags: {
    // false = el formulario NO envía nada y avisa que aún no está
    // activo. Ponerlo en true solo cuando las migraciones estén
    // aplicadas en producción y Patricio lo confirme por escrito.
    formularioActivo: false,

    // false = la sección QRs no aparece en el menú del sitio.
    // Sigue siendo accesible entrando directo a /qrs/.
    mostrarQRsEnMenu: false
  },

  /* 7 · Textos de error (en español, para el paciente) ----------- */
  errores: {
    tokenInvalido: 'Este código ya no sirve. Pídele al consultorio el código actualizado.',
    tokenFaltante: 'Falta el código del consultorio. Vuelve a escanear el QR.',
    nombreInvalido: 'Escribe tu nombre. Debe tener entre 2 y 120 letras.',
    apellidoInvalido: 'Escribe tu apellido paterno.',
    apellidoMaternoInvalido: 'Escribe tu apellido materno o marca "No tengo apellido materno".',
    correoInvalido: 'Revisa tu correo. Debe verse como nombre@dominio.com.',
    telefonoInvalido: 'El celular debe tener 10 dígitos, sin espacios ni guiones.',
    sexoInvalido: 'Elige una opción: Femenino, Masculino u Otro.',
    fechaInvalida: 'Revisa tu fecha de nacimiento. Usa día, mes y año; no puede ser futura.',
    limiteExcedido: 'Demasiados envíos desde este código. Espera unos minutos e inténtalo otra vez.',
    consentimientoFaltante: 'Marca la casilla del aviso de privacidad para enviar.',
    responsableFaltante: 'Como eres menor de 18, necesitamos el nombre y teléfono de tu persona responsable.',
    envioFallido: 'No pudimos enviar tus datos. Avisa en recepción.',
    noActivo: 'El registro en línea todavía no está activo en este consultorio. Pasa a recepción y con gusto te registran.'
  }
};
