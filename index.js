import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'

// ── Translations ──────────────────────────────────────────────────
const T = {
  en: {
    dir: 'ltr', s1: 'Symptoms', s2: 'Questions', s3: 'Remedies', s4: 'Follow-up',
    appName: 'kAImpo', tagline: 'Natural Remedy Guide',
    wt: 'What are you experiencing today?',
    ws: 'kAImpo gives you free, plant-based remedies drawn from 8 traditions of herbal medicine. No pharmacy needed — just nature.',
    tryThis: 'Try →', ph: 'Describe what you feel...',
    disc: '🌿 Natural remedy guidance · Always consult a healthcare professional for serious conditions',
    examples: [
      { l: 'Cold, congestion, sore throat', q: 'I have a bad cold with congestion and sore throat' },
      { l: 'Headache and tension', q: 'I have a headache and feel very tense' },
      { l: 'Stomach cramps and bloating', q: 'I have stomach cramps, bloating and poor digestion' },
      { l: 'Anxiety, stress, poor sleep', q: "I feel anxious, stressed and can't sleep well" },
    ],
    herbsTitle: '🌿 Herbal Remedies', foodsTitle: '🍽️ Foods & Nutrition',
    lifestyleTitle: '🌙 Lifestyle & Rest', clinicTitle: '🏥 Need a Clinic?',
    feedbackQ: 'How did the remedies work for you?',
    feedbackOpts: ['🌟 Really helped!', '✅ Somewhat helped', '😐 No noticeable change', '❌ Made it worse', '💬 Tell me more...'],
    locT: 'Would you like to find free care nearby?',
    locS: 'We can find community health centers, free clinics, and pharmacies near you.',
    locGps: '📍 Use my GPS', locPh: 'Or type your city...', locGo: 'Search',
    locating: 'Getting location...', geocoding: 'Searching...', fetching: 'Finding nearby care...',
    fAll: 'All', fHosp: '🏥 Hospitals', fClin: '🏥 Clinics', fPhar: '💊 Pharmacies', fPark: '🌳 Parks',
    noPl: 'No places found. Try another address.',
    errLoc: 'Could not get location. Try typing your address.',
    errGeo: 'Address not found. Please try again.',
    errNet: 'Something went wrong. Please try again.',
    emgT: '⚠️ This may need medical attention',
    emgC: 'Please seek emergency care or call your local emergency number immediately.',
    recLbl: 'Preparation', cautionLbl: 'Caution', srcLbl: 'Source',
    pT: 'My Remedy Journal', calT: '📅 Journal', histT: '📋 History',
    nocon: 'No entries yet.\nStart a consultation to begin your natural health journey.',
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    expTitle: 'kAImpo — Natural Remedy Journal',
    tabLi: 'Sign In', tabSu: 'Create Account', liB: 'Sign In', suB: 'Create Account',
    lName: 'Full Name', lEmail: 'Email', lPass: 'Password',
    authSub: 'Natural Remedy Guide · Free for everyone',
    authDisc: 'Free forever · No ads · Your data is private and secure',
    eEm: 'Please enter a valid email.', ePa: 'Password must be at least 6 characters.',
    eNm: 'Please enter your name.',
    plT: { hospital: 'Hospital', clinic: 'Clinic', pharmacy: 'Pharmacy', park: 'Park', doctors: 'Doctor', dentist: 'Dentist' },
  },
  fr: {
    dir: 'ltr', s1: 'Symptômes', s2: 'Questions', s3: 'Remèdes', s4: 'Suivi',
    appName: 'kAImpo', tagline: 'Guide de remèdes naturels',
    wt: 'Que ressentez-vous aujourd\'hui ?',
    ws: 'kAImpo vous propose des remèdes naturels gratuits issus de 8 traditions de médecine par les plantes.',
    tryThis: 'Essayer →', ph: 'Décrivez ce que vous ressentez...',
    disc: '🌿 Conseils en phytothérapie · Consultez un professionnel de santé pour les cas graves',
    examples: [
      { l: 'Rhume, congestion, gorge', q: "J'ai un mauvais rhume avec congestion et mal de gorge" },
      { l: 'Maux de tête et tension', q: 'J\'ai des maux de tête et je me sens très tendu(e)' },
      { l: 'Crampes et ballonnements', q: 'J\'ai des crampes d\'estomac, des ballonnements et une mauvaise digestion' },
      { l: 'Anxiété, stress, sommeil', q: "Je me sens anxieux/anxieuse, stressé(e) et je dors mal" },
    ],
    herbsTitle: '🌿 Remèdes herbaux', foodsTitle: '🍽️ Alimentation',
    lifestyleTitle: '🌙 Mode de vie et repos', clinicTitle: '🏥 Trouver une clinique ?',
    feedbackQ: 'Comment les remèdes ont-ils fonctionné ?',
    feedbackOpts: ['🌟 Vraiment aidé !', '✅ Partiellement aidé', '😐 Aucun changement', '❌ Empirer les choses', '💬 En dire plus...'],
    locT: 'Souhaitez-vous trouver des soins gratuits proches ?',
    locS: 'Nous pouvons trouver des centres de santé communautaires et des pharmacies près de chez vous.',
    locGps: '📍 Mon GPS', locPh: 'Ou tapez votre ville...', locGo: 'Chercher',
    locating: 'Localisation...', geocoding: 'Recherche...', fetching: 'Recherche des soins...',
    fAll: 'Tous', fHosp: '🏥 Hôpitaux', fClin: '🏥 Cliniques', fPhar: '💊 Pharmacies', fPark: '🌳 Parcs',
    noPl: 'Aucun lieu trouvé. Essayez une autre adresse.',
    errLoc: 'Position non disponible. Tapez votre adresse.',
    errGeo: 'Adresse introuvable.', errNet: 'Une erreur est survenue. Réessayez.',
    emgT: '⚠️ Cela peut nécessiter une attention médicale',
    emgC: 'Veuillez consulter un médecin ou appeler les secours immédiatement.',
    recLbl: 'Préparation', cautionLbl: 'Précaution', srcLbl: 'Source',
    pT: 'Mon journal de remèdes', calT: '📅 Journal', histT: '📋 Historique',
    nocon: 'Aucune entrée.\nCommencez une consultation pour démarrer votre parcours santé naturel.',
    months: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    days: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
    expTitle: 'kAImpo — Journal de remèdes naturels',
    tabLi: 'Se connecter', tabSu: 'Créer un compte', liB: 'Se connecter', suB: 'Créer un compte',
    lName: 'Nom complet', lEmail: 'Email', lPass: 'Mot de passe',
    authSub: 'Guide de remèdes naturels · Gratuit pour tous',
    authDisc: 'Gratuit · Sans publicité · Vos données sont privées et sécurisées',
    eEm: 'Email invalide.', ePa: 'Mot de passe min. 6 caractères.', eNm: 'Entrez votre nom.',
    plT: { hospital: 'Hôpital', clinic: 'Clinique', pharmacy: 'Pharmacie', park: 'Parc', doctors: 'Médecin', dentist: 'Dentiste' },
  },
  ar: {
    dir: 'rtl', s1: 'الأعراض', s2: 'أسئلة', s3: 'علاجات', s4: 'متابعة',
    appName: 'kAImpo', tagline: 'دليل العلاجات الطبيعية',
    wt: 'ماذا تشعر اليوم؟',
    ws: 'kAImpo يقدم لك علاجات نباتية مجانية مستوحاة من 8 تقاليد في الطب العشبي.',
    tryThis: 'جرّب ←', ph: 'صِف ما تشعر به...',
    disc: '🌿 إرشادات العلاجات الطبيعية · استشر متخصصاً للحالات الخطيرة',
    examples: [
      { l: 'زكام واحتقان وألم الحلق', q: 'أعاني من زكام شديد مع احتقان وألم في الحلق' },
      { l: 'صداع وتوتر', q: 'لدي صداع وأشعر بتوتر شديد' },
      { l: 'تشنجات معدية وانتفاخ', q: 'أعاني من تشنجات معدية وانتفاخ وسوء هضم' },
      { l: 'قلق وتوتر وأرق', q: 'أشعر بقلق وتوتر شديدين ولا أنام جيداً' },
    ],
    herbsTitle: '🌿 العلاجات العشبية', foodsTitle: '🍽️ الأطعمة والتغذية',
    lifestyleTitle: '🌙 نمط الحياة والراحة', clinicTitle: '🏥 البحث عن عيادة؟',
    feedbackQ: 'كيف نجحت العلاجات معك؟',
    feedbackOpts: ['🌟 ساعدت كثيراً!', '✅ ساعدت قليلاً', '😐 لا تغيير ملحوظ', '❌ جعلت الأمر أسوأ', '💬 أخبرنا أكثر...'],
    locT: 'هل تريد إيجاد رعاية مجانية قريبة منك؟',
    locS: 'يمكننا إيجاد مراكز صحية مجتمعية وصيدليات قريبة.',
    locGps: '📍 موقعي', locPh: 'أو اكتب مدينتك...', locGo: 'بحث',
    locating: 'جارٍ التحديد...', geocoding: 'جارٍ البحث...', fetching: 'بحث عن أقرب رعاية...',
    fAll: 'الكل', fHosp: '🏥 مستشفيات', fClin: '🏥 عيادات', fPhar: '💊 صيدليات', fPark: '🌳 حدائق',
    noPl: 'لم يتم العثور على أماكن.',
    errLoc: 'تعذر الموقع. اكتب عنوانك.', errGeo: 'العنوان غير موجود.', errNet: 'حدث خطأ. أعد المحاولة.',
    emgT: '⚠️ قد يحتاج هذا لعناية طبية', emgC: 'يرجى طلب الرعاية الطارئة فوراً.',
    recLbl: 'طريقة التحضير', cautionLbl: 'تحذير', srcLbl: 'المصدر',
    pT: 'مجلة علاجاتي', calT: '📅 المجلة', histT: '📋 السجل',
    nocon: 'لا توجد مدخلات بعد.\nابدأ استشارة لبناء سجلك الصحي.',
    months: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
    days: ['أحد','اثن','ثلا','أرب','خمس','جمع','سبت'],
    expTitle: 'kAImpo — مجلة العلاجات الطبيعية',
    tabLi: 'دخول', tabSu: 'إنشاء حساب', liB: 'دخول', suB: 'إنشاء حساب',
    lName: 'الاسم الكامل', lEmail: 'البريد الإلكتروني', lPass: 'كلمة المرور',
    authSub: 'دليل العلاجات الطبيعية · مجاني للجميع',
    authDisc: 'مجاني دائماً · بلا إعلانات · بياناتك خاصة وآمنة',
    eEm: 'بريد غير صالح.', ePa: 'كلمة المرور 6 أحرف على الأقل.', eNm: 'أدخل اسمك.',
    plT: { hospital: 'مستشفى', clinic: 'عيادة', pharmacy: 'صيدلية', park: 'حديقة', doctors: 'طبيب', dentist: 'طبيب أسنان' },
  },
  es: {
    dir: 'ltr', s1: 'Síntomas', s2: 'Preguntas', s3: 'Remedios', s4: 'Seguimiento',
    appName: 'kAImpo', tagline: 'Guía de remedios naturales',
    wt: '¿Cómo se siente hoy?',
    ws: 'kAImpo le ofrece remedios naturales gratuitos inspirados en 8 tradiciones de medicina herbal.',
    tryThis: 'Probar →', ph: 'Describa lo que siente...',
    disc: '🌿 Orientación en remedios naturales · Consulte un profesional de salud para casos graves',
    examples: [
      { l: 'Resfriado, congestión, garganta', q: 'Tengo un resfriado fuerte con congestión y dolor de garganta' },
      { l: 'Dolor de cabeza y tensión', q: 'Tengo dolor de cabeza y me siento muy tenso/a' },
      { l: 'Cólicos y distensión', q: 'Tengo cólicos estomacales, distensión y mala digestión' },
      { l: 'Ansiedad, estrés, sueño', q: 'Me siento ansioso/a, estresado/a y duermo mal' },
    ],
    herbsTitle: '🌿 Remedios herbales', foodsTitle: '🍽️ Alimentos y nutrición',
    lifestyleTitle: '🌙 Estilo de vida y descanso', clinicTitle: '🏥 ¿Necesita una clínica?',
    feedbackQ: '¿Cómo funcionaron los remedios para usted?',
    feedbackOpts: ['🌟 ¡Realmente ayudó!', '✅ Ayudó un poco', '😐 Sin cambio notable', '❌ Empeoró', '💬 Cuéntame más...'],
    locT: '¿Le gustaría encontrar atención gratuita cerca?',
    locS: 'Podemos encontrar centros de salud comunitarios y farmacias cerca de usted.',
    locGps: '📍 Mi GPS', locPh: 'O escriba su ciudad...', locGo: 'Buscar',
    locating: 'Obteniendo ubicación...', geocoding: 'Buscando...', fetching: 'Buscando atención...',
    fAll: 'Todos', fHosp: '🏥 Hospitales', fClin: '🏥 Clínicas', fPhar: '💊 Farmacias', fPark: '🌳 Parques',
    noPl: 'No se encontraron lugares.',
    errLoc: 'No se pudo obtener ubicación. Escriba su dirección.',
    errGeo: 'Dirección no encontrada.', errNet: 'Algo salió mal. Inténtelo de nuevo.',
    emgT: '⚠️ Esto puede necesitar atención médica',
    emgC: 'Por favor busque atención de emergencia inmediatamente.',
    recLbl: 'Preparación', cautionLbl: 'Precaución', srcLbl: 'Fuente',
    pT: 'Mi diario de remedios', calT: '📅 Diario', histT: '📋 Historial',
    nocon: 'Sin entradas todavía.\nComience una consulta para iniciar su viaje de salud natural.',
    months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    days: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    expTitle: 'kAImpo — Diario de remedios naturales',
    tabLi: 'Iniciar sesión', tabSu: 'Crear cuenta', liB: 'Iniciar sesión', suB: 'Crear cuenta',
    lName: 'Nombre completo', lEmail: 'Email', lPass: 'Contraseña',
    authSub: 'Guía de remedios naturales · Gratis para todos',
    authDisc: 'Gratuito · Sin anuncios · Sus datos son privados y seguros',
    eEm: 'Email inválido.', ePa: 'Contraseña mín. 6 caracteres.', eNm: 'Ingrese su nombre.',
    plT: { hospital: 'Hospital', clinic: 'Clínica', pharmacy: 'Farmacia', park: 'Parque', doctors: 'Médico', dentist: 'Dentista' },
  }
}

// ── Styles object ─────────────────────────────────────────────────
const S = {
  // Auth
  aov: { position:'fixed', inset:0, background:'rgba(30,20,5,.75)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 },
  abox: { background:'#fff', borderRadius:18, padding:26, width:'min(360px,94vw)', boxShadow:'0 20px 60px rgba(60,40,10,.25)', border:'1px solid #e8e0d4' },
  ahd: { display:'flex', alignItems:'center', gap:9, marginBottom:18 },
  aico: { width:38, height:38, background:'linear-gradient(135deg,#5c7a3e,#c4783a)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 },
  atabs: { display:'flex', background:'#faf7f2', borderRadius:9, padding:3, marginBottom:16, gap:2, border:'1px solid #e8e0d4' },
  af: { marginBottom:11 },
  afl: { display:'block', fontSize:10, fontWeight:700, color:'#8a7560', marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' },
  afi: { width:'100%', padding:'9px 12px', border:'1.5px solid #e8e0d4', borderRadius:9, fontFamily:'inherit', fontSize:13, color:'#2d2416', outline:'none', background:'#faf7f2' },
  abtn: { width:'100%', padding:11, background:'linear-gradient(135deg,#5c7a3e,#7a9e4a)', color:'#fff', border:'none', borderRadius:9, fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer', marginTop:3 },
}

export default function App() {
  const [lang, setLangState] = useState('en')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authTab, setAuthTab] = useState('login')
  const [authErr, setAuthErr] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState(1)
  const [consultId, setConsultId] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [profTab, setProfTab] = useState('cal')
  const [calMonth, setCalMonth] = useState(new Date())
  const [selDay, setSelDay] = useState(null)
  const [places, setPlaces] = useState([])
  const [mapFilter, setMapFilter] = useState('all')
  const [leafmap, setLeafmap] = useState(null)
  const [locLoading, setLocLoading] = useState(false)
  const [appLoaded, setAppLoaded] = useState(false)
  const msgsRef = useRef(null)
  const mapRef = useRef(null)
  const t = T[lang]

  // ── Init ──────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      }
      setAppLoaded(true)
    })
    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
      if (session?.user) loadProfile(session.user.id)
    })
  }, [])

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    document.documentElement.lang = lang
    document.body.dir = t.dir
  }, [lang, t.dir])

  useEffect(() => {
    if (user) loadConsultations()
  }, [user])

  async function loadProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) setProfile(data)
  }

  async function loadConsultations() {
    if (!user) return
    const { data } = await supabase.from('consultations').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) setConsultations(data)
  }

  // ── Auth ──────────────────────────────────────────────────────
  async function doLogin() {
    setAuthErr(''); setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) setAuthErr(error.message)
    setAuthLoading(false)
  }

  async function doSignup() {
    if (!form.name.trim()) { setAuthErr(t.eNm); return }
    if (!form.email.includes('@')) { setAuthErr(t.eEm); return }
    if (form.password.length < 6) { setAuthErr(t.ePa); return }
    setAuthErr(''); setAuthLoading(true)
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (error) { setAuthErr(error.message); setAuthLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, name: form.name.trim() })
      await loadProfile(data.user.id)
    }
    setAuthLoading(false)
  }

  async function doLogout() {
    await supabase.auth.signOut()
    setUser(null); setProfile(null); setMessages([]); setHistory([]); setStep(1); setConsultId(null)
  }

  // ── Chat ──────────────────────────────────────────────────────
  const userName = profile?.name?.split(' ')[0] || 'friend'

  async function getPrevFeedback() {
    if (!user) return ''
    const { data } = await supabase.from('consultations').select('feedback').eq('user_id', user.id).not('feedback', 'eq', '').order('created_at', { ascending: false }).limit(1)
    return data?.[0]?.feedback || ''
  }

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    const userMsg = { role: 'user', content: text, type: 'user', text }
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), userMsg])
    setInput('')
    const newHist = [...history, { role: 'user', content: text }]
    setHistory(newHist)
    setBusy(true)
    const prevFb = await getPrevFeedback()
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHist, language: lang, userName, prevFeedback: prevFb })
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json()
      setHistory(prev => [...prev, { role: 'assistant', content: JSON.stringify(data) }])
      if (data.type === 'followup') setStep(2)
      if (data.type === 'remedies' || data.type === 'emergency') setStep(3)
      setMessages(prev => [...prev, { ...data, id: 'bot_' + Date.now() }])
      // Save consultation
      if (data.type === 'remedies' && user) {
        const { data: saved } = await supabase.from('consultations').insert({
          user_id: user.id, symptoms: text, language: lang,
          herbs: data.herbs || [], foods: data.foods_nutrition || [],
          lifestyle: data.lifestyle || [], feedback: ''
        }).select().single()
        if (saved) { setConsultId(saved.id); await loadConsultations() }
      }
    } catch (e) {
      setMessages(prev => [...prev, { type: 'error', text: t.errNet, id: 'err_' + Date.now() }])
    }
    setBusy(false)
  }

  async function saveFeedback(fb) {
    if (!consultId || !user) return
    await supabase.from('consultations').update({ feedback: fb }).eq('id', consultId)
    await loadConsultations()
  }

  function resetChat() {
    setMessages([]); setHistory([]); setStep(1); setConsultId(null); setPlaces([])
    if (leafmap) { leafmap.remove(); setLeafmap(null) }
  }

  // ── Location ──────────────────────────────────────────────────
  async function doGPS() {
    if (!navigator.geolocation) { alert(t.errLoc); return }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      async p => { await fetchPlaces(p.coords.latitude, p.coords.longitude); setLocLoading(false) },
      () => { alert(t.errLoc); setLocLoading(false) },
      { timeout: 12000 }
    )
  }

  async function doAddr(val) {
    if (!val) return
    setLocLoading(true)
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=1`, { headers: { 'Accept-Language': lang } })
      const d = await r.json()
      if (!d.length) { alert(t.errGeo); setLocLoading(false); return }
      await fetchPlaces(parseFloat(d[0].lat), parseFloat(d[0].lon))
    } catch { alert(t.errGeo) }
    setLocLoading(false)
  }

  function haversine(a, b, c, d) {
    const R = 6371000, dL = (c-a)*Math.PI/180, dO = (d-b)*Math.PI/180
    const x = Math.sin(dL/2)**2 + Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dO/2)**2
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
  }
  function fmtDist(m) { return m < 1000 ? `${Math.round(m)}m` : `${(m/1000).toFixed(1)}km` }

  async function fetchPlaces(lat, lon) {
    const q = `[out:json][timeout:25];(node["amenity"~"hospital|clinic|pharmacy|doctors|dentist|community_centre"](around:3000,${lat},${lon});way["amenity"~"hospital|clinic|pharmacy|doctors"](around:3000,${lat},${lon});node["leisure"="park"](around:2000,${lat},${lon}););out center;`
    try {
      const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q) })
      const d = await r.json()
      const seen = new Set(); const found = []
      d.elements.forEach(el => {
        const elLat = el.lat ?? el.center?.lat, elLon = el.lon ?? el.center?.lon
        if (!elLat || !elLon) return
        const name = el.tags?.name || ''; if (!name) return
        const k = `${name}-${Math.round(elLat*100)}-${Math.round(elLon*100)}`; if (seen.has(k)) return; seen.add(k)
        const type = el.tags?.amenity || el.tags?.leisure || ''
        let emoji = '📍', fk = type
        if (type === 'hospital') { emoji = '🏥'; fk = 'hospital' }
        else if (['clinic','doctors','dentist','community_centre'].includes(type)) { emoji = '🏥'; fk = 'clinic' }
        else if (type === 'pharmacy') { emoji = '💊'; fk = 'pharmacy' }
        else if (type === 'park') { emoji = '🌳'; fk = 'park' }
        else return
        found.push({ name, lat: elLat, lon: elLon, dist: haversine(lat, lon, elLat, elLon), emoji, typeLabel: t.plT[type] || type, fk })
      })
      found.sort((a, b) => a.dist - b.dist)
      setPlaces(found)
      setStep(4)
      setTimeout(() => initMap(lat, lon, found), 200)
    } catch { alert(t.errNet) }
  }

  function initMap(lat, lon, foundPlaces) {
    if (!window.L || !mapRef.current) return
    if (leafmap) leafmap.remove()
    const m = window.L.map(mapRef.current).setView([lat, lon], 14)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(m)
    window.L.circleMarker([lat, lon], { radius: 8, color: '#5c7a3e', fillColor: '#5c7a3e', fillOpacity: 1 }).addTo(m).bindPopup('📍 You')
    foundPlaces.forEach(p => window.L.marker([p.lat, p.lon]).addTo(m).bindPopup(`<strong>${p.emoji} ${p.name}</strong><br>${p.typeLabel}<br>${fmtDist(p.dist)}`))
    setLeafmap(m)
  }

  // ── Calendar & History ─────────────────────────────────────────
  function getByDate() {
    const map = {}
    consultations.forEach(c => {
      const k = new Date(c.created_at).toDateString()
      map[k] = map[k] || []
      map[k].push(c)
    })
    return map
  }

  function exportJournal() {
    const t2 = T[lang]
    let txt = `${t2.expTitle}\n${'='.repeat(48)}\nName: ${profile?.name}\nGenerated: ${new Date().toLocaleString()}\n${'='.repeat(48)}\n\nDISCLAIMER: This journal is for informational purposes only.\nAlways consult a healthcare professional for serious conditions.\n\n`
    consultations.slice().reverse().forEach((c, i) => {
      const d = new Date(c.created_at)
      txt += `SESSION ${i+1} — ${d.toLocaleDateString([], { weekday:'long', year:'numeric', month:'long', day:'numeric' })}\n${'-'.repeat(36)}\n`
      txt += `Symptoms: ${c.symptoms || '—'}\n\n`
      if (c.herbs?.length) { txt += 'Herbs:\n'; c.herbs.forEach(h => txt += `  ${h.emoji} ${h.name} (${h.latin})\n  Prep: ${h.preparation}\n  Caution: ${h.caution}\n  Source: ${h.source}\n`); txt += '\n' }
      if (c.foods?.length) { txt += 'Foods:\n'; c.foods.forEach(f => txt += `  ${f.emoji} ${f.tip}\n`); txt += '\n' }
      if (c.lifestyle?.length) { txt += 'Lifestyle:\n'; c.lifestyle.forEach(l => txt += `  ${l.emoji} ${l.tip}\n`); txt += '\n' }
      if (c.feedback) { txt += `Feedback: ${c.feedback}\n\n` }
      txt += '\n'
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }))
    a.download = `kAImpo_${profile?.name?.replace(/\s/g,'_')}_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
  }

  // ── Render ────────────────────────────────────────────────────
  if (!appLoaded) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#faf7f2', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:40 }}>🌿</div>
      <div style={{ fontSize:14, color:'#8a7560' }}>Loading kAImpo...</div>
    </div>
  )

  const filteredPlaces = mapFilter === 'all' ? places : places.filter(p => p.fk === mapFilter)

  return (
    <>
      <Head>
        <title>kAImpo — Natural Remedy Guide</title>
        <meta name="description" content="Free, plant-based natural remedy guidance inspired by 8 herbal medicine traditions. No pharmacy needed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js" async />
      </Head>

      {/* ── Auth ── */}
      {!user && (
        <div style={S.aov}>
          <div style={S.abox}>
            <div style={S.ahd}>
              <div style={S.aico}>🌿</div>
              <div>
                <div style={{ fontSize:17, fontWeight:800, letterSpacing:'-.5px' }}>kAImpo</div>
                <div style={{ fontSize:10, color:'#8a7560' }}>{t.authSub}</div>
              </div>
            </div>
            <div style={S.atabs}>
              {['login','signup'].map(tab => (
                <button key={tab} onClick={() => { setAuthTab(tab); setAuthErr('') }} style={{ flex:1, padding:'7px', border:'none', borderRadius:7, background: authTab===tab ? '#fff':'transparent', fontFamily:'inherit', fontSize:12, fontWeight:600, color: authTab===tab ? '#5c7a3e':'#8a7560', cursor:'pointer', boxShadow: authTab===tab ? '0 1px 4px rgba(60,40,10,.08)':undefined }}>
                  {tab === 'login' ? t.tabLi : t.tabSu}
                </button>
              ))}
            </div>
            {authTab === 'signup' && (
              <div style={S.af}>
                <label style={S.afl}>{t.lName}</label>
                <input style={S.afi} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} />
              </div>
            )}
            <div style={S.af}>
              <label style={S.afl}>{t.lEmail}</label>
              <input style={S.afi} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} onKeyDown={e => e.key==='Enter' && (authTab==='login'?doLogin():doSignup())} />
            </div>
            <div style={S.af}>
              <label style={S.afl}>{t.lPass}</label>
              <input style={S.afi} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password:e.target.value}))} onKeyDown={e => e.key==='Enter' && (authTab==='login'?doLogin():doSignup())} />
            </div>
            <button style={{ ...S.abtn, opacity: authLoading ? .7:1 }} onClick={authTab==='login'?doLogin:doSignup} disabled={authLoading}>
              {authLoading ? '...' : (authTab==='login'?t.liB:t.suB)}
            </button>
            {authErr && <div style={{ fontSize:11, color:'#b84040', textAlign:'center', marginTop:6 }}>{authErr}</div>}
            <div style={{ fontSize:10, color:'#8a7560', textAlign:'center', marginTop:9, lineHeight:1.5 }}>{t.authDisc}</div>

            {/* Language selector in auth */}
            <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:12 }}>
              {['en','fr','ar','es'].map(l => (
                <button key={l} onClick={() => setLangState(l)} style={{ fontSize:11, fontWeight:700, padding:'2px 7px', borderRadius:5, border:'1px solid #e8e0d4', background: lang===l?'#5c7a3e':'transparent', color: lang===l?'#fff':'#8a7560', cursor:'pointer', fontFamily:'inherit' }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── App ── */}
      {user && (
        <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>

          {/* Header */}
          <header style={{ background:'#fff', borderBottom:'1px solid #e8e0d4', padding:'0 14px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:30, height:30, background:'linear-gradient(135deg,#5c7a3e,#c4783a)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🌿</div>
              <div>
                <div style={{ fontSize:15, fontWeight:900, letterSpacing:'-.5px' }}>kAImpo</div>
                <div style={{ fontSize:9.5, color:'#8a7560' }}>{t.tagline}</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <button onClick={() => setShowProfile(true)} style={{ display:'flex', alignItems:'center', gap:4, background:'#f0f5eb', border:'1px solid #b8d4a0', borderRadius:99, padding:'3px 9px 3px 3px', cursor:'pointer' }}>
                <div style={{ width:20, height:20, background:'linear-gradient(135deg,#5c7a3e,#c4783a)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#fff' }}>{profile?.name?.[0]?.toUpperCase() || '?'}</div>
                <span style={{ fontSize:11, fontWeight:700, color:'#5c7a3e' }}>{userName}</span>
              </button>
              <button onClick={resetChat} style={{ fontSize:11, padding:'3px 9px', background:'transparent', border:'1px solid #e8e0d4', borderRadius:99, cursor:'pointer', color:'#8a7560', fontFamily:'inherit' }}>↺</button>
              <button onClick={doLogout} style={{ fontSize:11, padding:'3px 9px', background:'transparent', border:'1px solid #e8e0d4', borderRadius:99, cursor:'pointer', color:'#8a7560', fontFamily:'inherit' }}>⏏</button>
              <div style={{ display:'flex', background:'#faf7f2', border:'1px solid #e8e0d4', borderRadius:7, padding:2, gap:1 }}>
                {['en','fr','ar','es'].map(l => (
                  <button key={l} onClick={() => setLangState(l)} style={{ fontSize:10.5, fontWeight:700, padding:'2px 6px', borderRadius:5, border:'none', background: lang===l?'#fff':'transparent', color: lang===l?'#5c7a3e':'#8a7560', cursor:'pointer', fontFamily:'inherit', boxShadow: lang===l?'0 1px 4px rgba(60,40,10,.08)':undefined }}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </header>

          {/* Step bar */}
          <div style={{ background:'#fff', borderBottom:'1px solid #e8e0d4', padding:'7px 14px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', flexDirection: t.dir==='rtl'?'row-reverse':'row' }}>
              {[t.s1,t.s2,t.s3,t.s4].map((label, i) => {
                const n = i+1
                const done = step > n, active = step === n
                return (
                  <div key={n} style={{ display:'flex', alignItems:'center' }}>
                    {i > 0 && <div style={{ width:22, height:2, background: step>n?'#7a9e7e':'#e8e0d4', margin:'0 4px', transition:'background .3s' }} />}
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, border:`2px solid ${done?'#7a9e7e':active?'#5c7a3e':'#e8e0d4'}`, background: done?'#7a9e7e':active?'#5c7a3e':'#fff', color: (done||active)?'#fff':'#8a7560', transition:'all .3s' }}>{done?'✓':n}</div>
                      <span style={{ fontSize:9, color: done?'#7a9e7e':active?'#5c7a3e':'#8a7560', fontWeight:600 }}>{label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:680, margin:'0 auto', width:'100%', padding:'0 12px' }}>
            <div ref={msgsRef} style={{ flex:1, overflowY:'auto', padding:'14px 0 8px', display:'flex', flexDirection:'column', gap:10 }}>

              {/* Welcome */}
              {messages.length === 0 && (
                <div style={{ textAlign:'center', padding:'20px 0 10px', animation:'fadeUp .3s ease' }}>
                  <div style={{ width:54, height:54, background:'linear-gradient(135deg,#5c7a3e,#c4783a)', borderRadius:15, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 10px' }}>🌿</div>
                  <h2 style={{ fontSize:17, fontWeight:900, marginBottom:5, letterSpacing:'-.4px' }}>{t.wt}</h2>
                  <p style={{ fontSize:11.5, color:'#8a7560', maxWidth:380, margin:'0 auto 14px', lineHeight:1.65 }}>{t.ws}</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5, maxWidth:420, margin:'0 auto' }}>
                    {t.examples.map((ex, i) => (
                      <button key={i} onClick={() => { setInput(ex.q); setTimeout(()=>send(), 0) }}
                        style={{ background:'#fff', border:'1px solid #e8e0d4', borderRadius:9, padding:'8px 10px', cursor:'pointer', fontSize:11, textAlign:'left', lineHeight:1.4, fontFamily:'inherit', color:'#2d2416', boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
                        <div style={{ fontSize:9, color:'#8a7560', marginBottom:1 }}>{t.tryThis}</div>
                        {ex.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => <MessageBubble key={msg.id||i} msg={msg} t={t} userName={userName} onFeedback={saveFeedback} onGPS={doGPS} onAddr={doAddr} locLoading={locLoading} places={places} filteredPlaces={filteredPlaces} mapFilter={mapFilter} setMapFilter={setMapFilter} leafmap={leafmap} mapRef={mapRef} fmtDist={fmtDist} profileName={profile?.name} onQR={text => { setInput(text); setTimeout(send,50) }} />)}

              {/* Typing */}
              {busy && (
                <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
                  <div style={{ width:27, height:27, borderRadius:'50%', background:'linear-gradient(135deg,#5c7a3e,#c4783a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🌿</div>
                  <div style={{ background:'#fff', border:'1px solid #e8e0d4', borderRadius:'14px 14px 14px 4px', padding:'10px 14px', boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding:'8px 0 13px', borderTop:'1px solid #e8e0d4' }}>
              <div style={{ display:'flex', gap:7, background:'#fff', border:'1.5px solid #e8e0d4', borderRadius:14, padding:'6px 6px 6px 13px', boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }} placeholder={t.ph}
                  style={{ flex:1, border:'none', outline:'none', fontSize:12.5, fontFamily:'inherit', background:'transparent', resize:'none', maxHeight:80, lineHeight:1.5, color:'#2d2416' }} rows={1}
                  ref={el => { if(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,80)+'px'} }} />
                <button onClick={send} disabled={busy} style={{ width:30, height:30, background: busy?'#e8e0d4':'linear-gradient(135deg,#5c7a3e,#7a9e4a)', border:'none', borderRadius:7, cursor: busy?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, alignSelf:'flex-end' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <div style={{ fontSize:9.5, color:'#8a7560', textAlign:'center', paddingTop:5 }}>{t.disc}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile overlay ── */}
      {showProfile && (
        <div style={{ position:'fixed', inset:0, background:'#faf7f2', zIndex:900, display:'flex', flexDirection:'column', animation:'fadeIn .25s ease' }}>
          <div style={{ background:'#fff', borderBottom:'1px solid #e8e0d4', padding:'0 14px', height:50, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ fontSize:14, fontWeight:800 }}>{t.pT}</div>
            <div style={{ display:'flex', gap:7, alignItems:'center' }}>
              <button onClick={exportJournal} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', background:'linear-gradient(135deg,#5c7a3e,#7a9e4a)', color:'#fff', border:'none', borderRadius:9, fontFamily:'inherit', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>📄 Export</button>
              <button onClick={() => setShowProfile(false)} style={{ fontSize:11, padding:'4px 10px', background:'transparent', border:'1px solid #e8e0d4', borderRadius:99, cursor:'pointer', fontFamily:'inherit', color:'#8a7560' }}>← Back</button>
            </div>
          </div>
          <div style={{ display:'flex', background:'#fff', borderBottom:'1px solid #e8e0d4', padding:'0 14px', flexShrink:0 }}>
            {[{k:'cal',l:t.calT},{k:'hist',l:t.histT}].map(tab => (
              <button key={tab.k} onClick={() => setProfTab(tab.k)} style={{ padding:'10px 13px', fontSize:12, fontWeight:600, color: profTab===tab.k?'#5c7a3e':'#8a7560', cursor:'pointer', borderBottom: profTab===tab.k?'2px solid #5c7a3e':'2px solid transparent', background:'none', border:'none', borderBottom: profTab===tab.k?'2px solid #5c7a3e':'2px solid transparent', fontFamily:'inherit' }}>{tab.l}</button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:16 }}>
            {profTab === 'cal' ? (
              <CalendarView consultations={consultations} calMonth={calMonth} setCalMonth={setCalMonth} selDay={selDay} setSelDay={setSelDay} t={t} />
            ) : (
              <HistoryView consultations={consultations} t={t} />
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:3, alignItems:'center', padding:'2px 0' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:5, height:5, background:'#8a7560', borderRadius:'50%', display:'block', animation:`bounce 1.2s ${i*0.2}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-4px)}}`}</style>
    </div>
  )
}

function MessageBubble({ msg, t, userName, onFeedback, onGPS, onAddr, locLoading, places, filteredPlaces, mapFilter, setMapFilter, leafmap, mapRef, fmtDist, profileName, onQR }) {
  const [addrVal, setAddrVal] = useState('')
  const [selFb, setSelFb] = useState('')
  const [showMap, setShowMap] = useState(false)

  const bubStyle = { maxWidth:'88%', borderRadius:14, padding:'9px 13px', fontSize:12.5, lineHeight:1.7, background:'#fff', border:'1px solid #e8e0d4', borderTopLeftRadius:4, boxShadow:'0 1px 4px rgba(60,40,10,.08)', animation:'fadeUp .2s ease' }

  if (msg.role === 'user' || msg.type === 'user') {
    return (
      <div style={{ display:'flex', flexDirection:'row-reverse', gap:7, alignItems:'flex-start', animation:'fadeUp .2s ease' }}>
        <div style={{ width:27, height:27, borderRadius:'50%', background:'#f0f5eb', border:'1px solid #b8d4a0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#5c7a3e', flexShrink:0 }}>{profileName?.[0]?.toUpperCase()||'?'}</div>
        <div style={{ ...bubStyle, background:'#5c7a3e', color:'#fff', borderTopLeftRadius:14, borderTopRightRadius:4, border:'none', boxShadow:'none' }}>{msg.content || msg.text}</div>
      </div>
    )
  }

  if (msg.type === 'error') {
    return (
      <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
        <div style={{ width:27, height:27, borderRadius:'50%', background:'linear-gradient(135deg,#5c7a3e,#c4783a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🌿</div>
        <div style={{ ...bubStyle, color:'#b84040', background:'#fdf0f0', border:'1px solid #e8b0b0' }}>⚠️ {msg.text}</div>
      </div>
    )
  }

  if (msg.type === 'emergency') return (
    <div style={{ display:'flex', gap:7, alignItems:'flex-start', animation:'fadeUp .2s ease' }}>
      <div style={{ width:27, height:27, borderRadius:'50%', background:'linear-gradient(135deg,#5c7a3e,#c4783a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🌿</div>
      <div style={{ ...bubStyle }}>
        <div style={{ background:'#fdf0f0', border:'1px solid #e8b0b0', borderRadius:9, padding:'11px 13px', color:'#b84040', fontWeight:600, lineHeight:1.6 }}>
          <strong>{t.emgT}</strong><br/>{msg.message}
          <div style={{ fontSize:11, marginTop:7, padding:'6px 9px', background:'rgba(255,255,255,.6)', borderRadius:6, lineHeight:1.5 }}><strong>{t.emgC}</strong></div>
        </div>
      </div>
    </div>
  )

  if (msg.type === 'followup') return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', gap:7, alignItems:'flex-start', animation:'fadeUp .2s ease' }}>
        <div style={{ width:27, height:27, borderRadius:'50%', background:'linear-gradient(135deg,#5c7a3e,#c4783a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🌿</div>
        <div style={bubStyle} dangerouslySetInnerHTML={{ __html: msg.message?.replace(/\n/g,'<br>') }} />
      </div>
      {msg.quick_replies?.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, paddingLeft:34 }}>
          {msg.quick_replies.map((r, i) => (
            <button key={i} onClick={() => onQR(r)} style={{ fontSize:11, padding:'5px 11px', background:'#fff', border:'1px solid #e8e0d4', borderRadius:99, cursor:'pointer', color:'#2d2416', fontFamily:'inherit', boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>{r}</button>
          ))}
        </div>
      )}
    </div>
  )

  if (msg.type === 'remedies') return (
    <div style={{ display:'flex', gap:7, alignItems:'flex-start', animation:'fadeUp .2s ease' }}>
      <div style={{ width:27, height:27, borderRadius:'50%', background:'linear-gradient(135deg,#5c7a3e,#c4783a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>🌿</div>
      <div style={{ ...bubStyle, maxWidth:'92%' }}>
        <p style={{ marginBottom:10 }}>{msg.message}</p>

        {/* Herbs */}
        {msg.herbs?.length > 0 && <>
          <SecTitle>{t.herbsTitle}</SecTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {msg.herbs.map((h, i) => (
              <div key={i} style={{ background:'#eef4ef', border:'1px solid #c8deca', borderRadius:9, padding:'9px 11px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'#7a9e7e', borderRadius:'3px 0 0 3px' }} />
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:4, marginBottom:3 }}>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'#2d5a30' }}>{h.emoji} {h.name}</div>
                    <div style={{ fontSize:10, color:'#7a9e7e', fontStyle:'italic' }}>{h.latin}</div>
                  </div>
                  <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                    {h.tags?.map((tag,j) => <span key={j} style={{ fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:99, background:'#f0f5eb', color:'#5c7a3e', border:'1px solid #b8d4a0' }}>{tag}</span>)}
                  </div>
                </div>
                <div style={{ fontSize:11.5, color:'#2d5a30', lineHeight:1.55, marginBottom:5 }}><strong>{t.recLbl}:</strong> {h.preparation}</div>
                {h.caution && h.caution !== 'None known' && <div style={{ fontSize:10.5, color:'#7a4a20', background:'#fdf3e8', border:'1px solid #f0c8a0', borderRadius:6, padding:'4px 7px', lineHeight:1.4 }}>⚠️ <strong>{t.cautionLbl}:</strong> {h.caution}</div>}
                <div style={{ fontSize:9, color:'#8a7560', marginTop:4, fontStyle:'italic' }}>{t.srcLbl}: {h.source}</div>
              </div>
            ))}
          </div>
        </>}

        {/* Foods */}
        {msg.foods_nutrition?.length > 0 && <>
          <SecTitle>{t.foodsTitle}</SecTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {msg.foods_nutrition.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', background:'#fdf3e8', border:'1px solid #f0c8a0', borderRadius:6, padding:'6px 9px' }}>
                <span style={{ fontSize:15, marginRight:8, flexShrink:0 }}>{f.emoji}</span>
                <span style={{ fontSize:11.5, color:'#6a3a10', fontWeight:500, lineHeight:1.4 }}>{f.tip}</span>
              </div>
            ))}
          </div>
        </>}

        {/* Lifestyle */}
        {msg.lifestyle?.length > 0 && <>
          <SecTitle>{t.lifestyleTitle}</SecTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {msg.lifestyle.map((l, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:6, padding:'6px 9px' }}>
                <span style={{ fontSize:15, marginRight:8, flexShrink:0 }}>{l.emoji}</span>
                <span style={{ fontSize:11.5, color:'#5b21b6', fontWeight:500 }}>{l.tip}</span>
              </div>
            ))}
          </div>
        </>}

        {/* Feedback */}
        <div style={{ background:'linear-gradient(135deg,#f8f3eb,#eef4ef)', border:'1px solid #e8e0d4', borderRadius:9, padding:'11px 13px', marginTop:10 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#2d2416', marginBottom:8 }}>{t.feedbackQ}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {t.feedbackOpts.map((o, i) => (
              <button key={i} onClick={() => { setSelFb(o); onFeedback(o) }}
                style={{ fontSize:11.5, padding:'5px 12px', border:`1.5px solid ${selFb===o?'#5c7a3e':'#e8e0d4'}`, borderRadius:99, cursor:'pointer', fontFamily:'inherit', background: selFb===o?'#5c7a3e':'#fff', color: selFb===o?'#fff':'#2d2416', transition:'all .15s' }}>{o}</button>
            ))}
          </div>
        </div>

        {/* Clinic finder */}
        {msg.ask_clinic && <>
          <SecTitle>{t.clinicTitle}</SecTitle>
          <div style={{ background:'linear-gradient(135deg,#3a5c28,#7a4a1a)', borderRadius:9, padding:13, color:'#fff', marginTop:0 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:3 }}>{t.locT}</div>
            <div style={{ fontSize:10.5, opacity:.8, marginBottom:10, lineHeight:1.4 }}>{t.locS}</div>
            <button onClick={onGPS} disabled={locLoading} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(255,255,255,.95)', color:'#3a5c28', border:'none', borderRadius:99, padding:'7px 14px', fontSize:11.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {locLoading ? '...' : t.locGps}
            </button>
            <div style={{ display:'flex', gap:4, marginTop:8 }}>
              <input value={addrVal} onChange={e=>setAddrVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onAddr(addrVal)}
                placeholder={t.locPh} style={{ flex:1, padding:'6px 10px', borderRadius:99, border:'none', fontSize:11.5, outline:'none', fontFamily:'inherit', background:'rgba(255,255,255,.2)', color:'#fff' }} />
              <button onClick={() => onAddr(addrVal)} style={{ padding:'6px 12px', borderRadius:99, border:'none', background:'rgba(255,255,255,.3)', color:'#fff', cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'inherit' }}>{t.locGo}</button>
            </div>
          </div>

          {/* Map */}
          {places.length > 0 && (
            <div style={{ marginTop:8 }}>
              <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginBottom:5 }}>
                {[{k:'all',l:t.fAll},{k:'hospital',l:t.fHosp},{k:'clinic',l:t.fClin},{k:'pharmacy',l:t.fPhar},{k:'park',l:t.fPark}].map(f => (
                  <button key={f.k} onClick={() => setMapFilter(f.k)} style={{ fontSize:10, padding:'3px 8px', borderRadius:99, border:`1px solid ${mapFilter===f.k?'#5c7a3e':'#e8e0d4'}`, background: mapFilter===f.k?'#5c7a3e':'#fff', color: mapFilter===f.k?'#fff':'#8a7560', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>{f.l}</button>
                ))}
              </div>
              <div ref={mapRef} style={{ height:200, borderRadius:9, overflow:'hidden', border:'1px solid #e8e0d4' }} />
              <div style={{ display:'flex', flexDirection:'column', gap:3, marginTop:5 }}>
                {filteredPlaces.slice(0,6).map((p, i) => (
                  <div key={i} onClick={() => leafmap?.setView([p.lat,p.lon],16)} style={{ display:'flex', alignItems:'center', background:'#fff', border:'1px solid #e8e0d4', borderRadius:6, padding:'6px 9px', gap:7, boxShadow:'0 1px 4px rgba(60,40,10,.08)', cursor:'pointer' }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{p.emoji}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11.5, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize:10, color:'#8a7560' }}>{p.typeLabel}</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#5c7a3e', flexShrink:0 }}>{fmtDist(p.dist)}</div>
                  </div>
                ))}
                {filteredPlaces.length === 0 && <div style={{ fontSize:11.5, color:'#8a7560', textAlign:'center', padding:12 }}>{t.noPl}</div>}
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  )

  return null
}

function SecTitle({ children }) {
  return (
    <div style={{ fontSize:9.5, fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em', color:'#8a7560', margin:'12px 0 6px', display:'flex', alignItems:'center', gap:5 }}>
      {children}
      <div style={{ flex:1, height:1, background:'#e8e0d4' }} />
    </div>
  )
}

function CalendarView({ consultations, calMonth, setCalMonth, selDay, setSelDay, t }) {
  const y = calMonth.getFullYear(), mo = calMonth.getMonth()
  const firstDay = new Date(y, mo, 1).getDay()
  const daysInMonth = new Date(y, mo+1, 0).getDate()
  const today = new Date()
  const byDate = {}
  consultations.forEach(c => {
    const k = new Date(c.created_at).toDateString()
    byDate[k] = byDate[k] || []
    byDate[k].push(c)
  })

  return (
    <div style={{ maxWidth:520, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <button onClick={() => setCalMonth(new Date(y,mo-1,1))} style={{ background:'none', border:'1px solid #e8e0d4', borderRadius:7, width:27, height:27, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit', color:'#2d2416' }}>‹</button>
        <h3 style={{ fontSize:13.5, fontWeight:800 }}>{t.months[mo]} {y}</h3>
        <button onClick={() => setCalMonth(new Date(y,mo+1,1))} style={{ background:'none', border:'1px solid #e8e0d4', borderRadius:7, width:27, height:27, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit', color:'#2d2416' }}>›</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
        {t.days.map(d => <div key={d} style={{ fontSize:9, fontWeight:700, textAlign:'center', color:'#8a7560', padding:'3px 0' }}>{d}</div>)}
        {Array(firstDay).fill(null).map((_,i) => <div key={'e'+i} />)}
        {Array(daysInMonth).fill(null).map((_,i) => {
          const day = i+1
          const date = new Date(y, mo, day)
          const k = date.toDateString()
          const hasCons = !!byDate[k]
          const isToday = date.toDateString() === today.toDateString()
          const isSel = selDay === k
          return (
            <div key={day} onClick={() => hasCons && setSelDay(isSel ? null : k)}
              style={{ aspectRatio:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', borderRadius:7, fontSize:11, fontWeight:500, cursor:hasCons?'pointer':'default', background: isSel?'#5c7a3e':isToday?'#f0f5eb':hasCons?'linear-gradient(135deg,#f0f5eb,#fdf8e8)':'transparent', border:hasCons?'1px solid #b8d4a0':isToday?'1px solid #b8d4a0':'none', color: isSel?'#fff':isToday||hasCons?'#2d5a30':'#2d2416', fontWeight:isToday?800:500, position:'relative' }}>
              {day}
              {hasCons && <div style={{ width:4, height:4, background: isSel?'#fff':'#5c7a3e', borderRadius:'50%', position:'absolute', bottom:2 }} />}
            </div>
          )
        })}
      </div>
      {selDay && byDate[selDay] && (
        <div style={{ background:'#fff', border:'1px solid #e8e0d4', borderRadius:11, padding:12, marginTop:11, boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
          <div style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#8a7560', marginBottom:7 }}>{new Date(selDay).toLocaleDateString([], { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
          {byDate[selDay].map((c, i) => (
            <div key={i}>
              {c.symptoms && <div style={{ fontSize:12, color:'#2d2416', background:'#faf7f2', borderRadius:6, padding:'5px 8px', fontStyle:'italic', marginBottom:6 }}>"{c.symptoms}"</div>}
              {c.herbs?.length > 0 && <div style={{ marginBottom:5 }}>{c.herbs.map(h => <div key={h.name} style={{ fontSize:12.5, fontWeight:700, color:'#5c7a3e' }}>{h.emoji} {h.name}</div>)}</div>}
              {c.feedback && <div style={{ fontSize:11, padding:'3px 7px', borderRadius:6, display:'inline-block', background:'#eef4ef', color:'#2d5a30', border:'1px solid #c8deca' }}>{c.feedback}</div>}
            </div>
          ))}
        </div>
      )}
      {consultations.length === 0 && <div style={{ textAlign:'center', padding:'36px 14px', color:'#8a7560' }}><div style={{ fontSize:36, marginBottom:8 }}>🌿</div><p style={{ fontSize:12, lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: t.nocon.replace('\n','<br>') }} /></div>}
    </div>
  )
}

function HistoryView({ consultations, t }) {
  if (!consultations.length) return (
    <div style={{ textAlign:'center', padding:'36px 14px', color:'#8a7560' }}>
      <div style={{ fontSize:36, marginBottom:8 }}>🌿</div>
      <p style={{ fontSize:12, lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: t.nocon.replace('\n','<br>') }} />
    </div>
  )
  return (
    <div>
      {consultations.map((c, i) => {
        const d = new Date(c.created_at)
        return (
          <div key={c.id} style={{ background:'#fff', border:'1px solid #e8e0d4', borderRadius:11, padding:11, marginBottom:7, boxShadow:'0 1px 4px rgba(60,40,10,.08)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:9.5, color:'#8a7560', fontWeight:500 }}>{d.toLocaleDateString([], { month:'short', day:'numeric', year:'numeric' })} · {d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
              {c.feedback && <span style={{ fontSize:10 }}>{c.feedback.split(' ')[0]}</span>}
            </div>
            {c.symptoms && <div style={{ fontSize:12, fontStyle:'italic', marginBottom:4, lineHeight:1.4 }}>"{c.symptoms}"</div>}
            <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
              {(c.herbs||[]).map(h => <span key={h.name} style={{ fontSize:10, background:'#eef4ef', color:'#7a9e7e', border:'1px solid #c8deca', borderRadius:99, padding:'1px 7px', fontWeight:600 }}>{h.emoji} {h.name}</span>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
