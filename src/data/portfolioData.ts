export type WorkCategoryId = 'design' | 'web' | 'video' | 'photo';

export interface WorkCategory {
  id: WorkCategoryId;
  labelTh: string;
  labelEn: string;
  anchorId: string;
}

export interface FeaturedProject {
  id: string;
  number: string;
  categoryId: WorkCategoryId;
  categoryEn: string;
  title: string;
  subtitle: string;
  role: string;
  tools: string[];
  image: string;
  imageAlt: string;
  aspectType: 'landscape' | 'portrait-ui' | 'studio';
  themeTint: 'mint' | 'gold' | 'cyan';
  challenge: string;
  thinking: string;
  outcome: string;
  behindTheScenes: string[];
  liveUrl?: string;
  liveLabel?: string;
  driveUrl?: string;
  videoPreviewUrl?: string;
  videoMeta?: {
    filename: string;
    sizeLabel: string;
    note: string;
  };
}

export interface CoreSkill {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  targetSectionId: string;
  relatedCategory: WorkCategoryId;
}

export interface CarouselSlide {
  id: string;
  label: string;
  sublabel: string;
  kind: 'placeholder' | 'image';
  image?: string;
  alt: string;
  placeholderNote?: string;
}

export const PORTFOLIO_DATA = {
  owner: {
    fullName: 'นายเฟื่องตระกูล เฟื่องฟู',
    shortName: 'เฟื่อง',
    brandEn: 'FUEANGTRAKUL',
    brandTag: 'UX/UI · GRAPHIC · WEB PROTOTYPE',
    roleLine: 'UX/UI Design · Graphic Designer · Web Prototype',
    heroEyebrow: 'FUEANGTRAKUL · CREATIVE PORTFOLIO',
    heroHeadlineLine1: 'ผมชื่อเฟื่อง',
    heroHeadlineLine2: 'เด็กที่หลงใหลในโลกของไอที',
    heroSub:
      'นักเรียนชั้น ม.6 ที่สนใจด้าน UX/UI Design การพัฒนาเว็บต้นแบบ และการประยุกต์ใช้ AI เพื่อสร้างประสบการณ์การใช้งานที่เข้าใจง่ายและตอบโจทย์ผู้ใช้งาน',
    targetUniversity: 'เตรียมตัวเข้าศึกษาต่อคณะเทคโนโลยีสารสนเทศ (IT) สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
    heroBackdropImage: '/src/assets/images/hero_it_workspace_1795330548485.jpg',
    resumeUrl: 'https://canva.link/zj63ooopi7vtdya',
    contact: {
      email: 'fueangtrakul@gmail.com',
      lineId: '0631370432',
      socialHandle: 'Fueangtrakul',
      socialPlatformLabel: 'Facebook / Instagram',
    },
  },

  categories: [
    { id: 'design', labelTh: 'งานออกแบบ', labelEn: 'UX/UI & GRAPHIC', anchorId: 'project-pet-mood' },
    { id: 'web', labelTh: 'เว็บไซต์', labelEn: 'WEB PROTOTYPE', anchorId: 'project-hiewhiw' },
    { id: 'video', labelTh: 'วิดีโอ', labelEn: 'VIDEO & MOTION', anchorId: 'project-graphic-video' },
    { id: 'photo', labelTh: 'ภาพถ่าย', labelEn: 'PHOTOGRAPHY', anchorId: 'project-photo' },
  ] as WorkCategory[],

  projects: [
    {
      id: 'hiewhiw',
      number: '01',
      categoryId: 'web',
      categoryEn: '01 / WEB APPLICATION · UX/UI & PROTOTYPE',
      title: 'HiewHiw',
      subtitle: 'เว็บแอปพลิเคชันรับฝากซื้ออาหารในหอพักนักศึกษา',
      role: 'UX/UI Designer & Web Prototyper',
      tools: ['UX/UI Design', 'Wireframe', 'Web Prototype', 'Vercel'],
      image: '/src/assets/images/hiewhiw_showcase_1795330548492.jpg',
      imageAlt: 'ตัวอย่างหน้าจอเว็บแอปพลิเคชัน HiewHiw สำหรับฝากซื้ออาหารในหอพัก',
      aspectType: 'landscape',
      themeTint: 'gold',
      challenge:
        'นักศึกษาในหอพักมักเจอปัญหาอยากสั่งอาหารจากร้านหน้าหอหรือโรงอาหาร แต่ไม่สะดวกเดินลงไปซื้อเอง หรือค่าส่งแอปทั่วไปสูงเกินไปสำหรับการสั่งเพียงหนึ่งจาน',
      thinking:
        'ออกแบบ User Flow ให้เปิดออเดอร์รับฝากและกดฝากซื้อได้ภายในไม่กี่ขั้นตอน จัดลำดับข้อมูลร้านค้า ราคา และจุดนัดรับในหอพักให้สแกนอ่านง่ายบนจอมือถือ',
      outcome:
        'พัฒนาเป็นเว็บแอปต้นแบบที่ใช้งานได้จริงบน hiewhiw.vercel.app เพื่อทดสอบแนวคิดการช่วยเพื่อนร่วมหอพักฝากซื้ออาหารร่วมกัน',
      behindTheScenes: [
        'เริ่มต้นจากการวิเคราะห์ขั้นตอนการฝากซื้ออาหารผ่านแชทกลุ่มที่มีข้อมูลตกหล่นบ่อย เช่น เมนู เพิ่มเติม ราคา และห้องผู้สั่ง',
        'ออกแบบโครงสร้างหน้าจอ (Wireframe) แยกบทบาทระหว่างผู้รับฝากและผู้ฝากซื้อให้ชัดเจน ลดความสับสนในการสรุปยอด',
        'นำขึ้นใช้งานจริงบน Vercel เพื่อให้เปิดทดลองได้จากทั้งมือถือและเดสก์ท็อป',
      ],
      liveUrl: 'https://hiewhiw.vercel.app',
      liveLabel: 'เปิดเว็บ HiewHiw',
    },
    {
      id: 'pet-mood',
      number: '02',
      categoryId: 'design',
      categoryEn: '02 / AI WEB PROTOTYPE · UX/UI DESIGN',
      title: 'Pet Mood Translator',
      subtitle: 'เว็บต้นแบบแปลอารมณ์สัตว์เลี้ยงด้วย AI',
      role: 'UX/UI Designer & Prototyper',
      tools: ['UX/UI Design', 'AI Concept', 'Mobile First UI', 'Prototype'],
      image: '/assets/pet-mood-translator.png',
      imageAlt: 'หน้าจอออกแบบจริงของเว็บต้นแบบ Pet Mood Translator',
      aspectType: 'portrait-ui',
      themeTint: 'mint',
      challenge:
        'ผู้เลี้ยงสุนัขและแมวมักอยากเข้าใจความรู้สึกจากเสียงร้องหรือภาษากายของสัตว์เลี้ยง แต่เครื่องมือวิเคราะห์เสียงทั่วไปมักซับซ้อนและขาดความเป็นมิตร',
      thinking:
        'ออกแบบอินเทอร์เฟซแบบ Mobile-First ที่เข้าถึงง่าย ใช้โทนสีธรรมชาติและปุ่มหลักที่กดเริ่มวิเคราะห์เสียงได้ทันที พร้อมแบ่งหมวดเลือกสัตว์ ตรวจจับสด และแดชบอร์ดชัดเจน',
      outcome:
        'ได้หน้าจอเว็บต้นแบบที่เชื่อมแนวคิด AI Voice Analysis และ Visual Companion เข้าด้วยกันอย่างลงตัว มีภาพต้นฉบับพร้อมนำไปต่อยอดพัฒนาโมเดลจริง',
      behindTheScenes: [
        'ภาพตัวอย่างที่แสดงเป็นหน้าจอต้นแบบจริง (IMG_7333.png) ที่ออกแบบให้รองรับการใช้งานบนสมาร์ตโฟนด้วยนิ้วมือเดียว',
        'จัดวาง Hierarchy ให้ผู้ใช้เห็นสถานะอารมณ์สัตว์เลี้ยงทันที พร้อมแถบนำทาง 4 ส่วนหลัก: หน้าแรก · เลือกสัตว์ · ตรวจจับสด · แดชบอร์ด',
        'เตรียมจุดต่อยอดระบบ Voice Analysis เพื่อถอดรหัสคลื่นเสียงเห่า เสียงคราง และระดับความถี่',
      ],
      driveUrl: 'https://drive.google.com/file/d/1NAht_FTJKMB0_bG6JJ2z94948qZBiONW/view?usp=drivesdk',
    },
    {
      id: 'graphic-video',
      number: '03',
      categoryId: 'video',
      categoryEn: '03 / GRAPHIC DESIGN & VIDEO EDITING',
      title: 'งานออกแบบกราฟิก & วิดีโอนำเสนอ',
      subtitle: 'สื่อภาพนิ่งและวิดีโอเล่าเรื่องด้วย Canva, Procreate และ CapCut',
      role: 'Graphic Designer & Video Editor',
      tools: ['Canva', 'Procreate', 'CapCut', 'Visual Storytelling'],
      image: '/src/assets/images/graphic_motion_studio_1795330548286.jpg',
      imageAlt: 'สตูดิโองานออกแบบกราฟิกและไทม์ไลน์วิดีโอนำเสนอ',
      aspectType: 'studio',
      themeTint: 'cyan',
      challenge:
        'การสื่อสารไอเดียด้านเทคโนโลยีและงานออกแบบให้คนทั่วไปเข้าใจได้เร็ว ต้องอาศัยทั้งองค์ประกอบภาพที่ดึงดูดและจังหวะการตัดต่อที่กระชับ',
      thinking:
        'ผสมผสานการวาดและจัดเลย์เอาต์จาก Procreate และ Canva เข้ากับการเล่าเรื่องด้วยจังหวะภาพ เสียง และตัวอักษรใน CapCut ให้ทุกเฟรมมีจุดโฟกัสเดียว',
      outcome:
        'ผลิตชิ้นงานกราฟิกและวิดีโอนำเสนอต้นแบบ (ไฟล์ SOFTWARE_092_Niceday3.mov) สำหรับถ่ายทอดแนวคิดโปรเจกต์และ Portfolio นำเสนอ',
      behindTheScenes: [
        'วางสคริปต์ภาพและลำดับจังหวะตัดต่อก่อนเริ่มประกอบไทม์ไลน์ เพื่อคุมระยะเวลาให้น่าติดตาม',
        'ใช้การจัดวางตัวอักษรและคอนทราสต์สีช่วยเน้นประเด็นสำคัญในแต่ละฉาก',
        'ไฟล์วิดีโอจริง (SOFTWARE_092_Niceday3.mov · 149 MB) สามารถกดรับชมได้แบบ On-Demand ผ่านหน้าต่างวิดีโอหรือ Google Drive โดยไม่โหลดล่วงหน้า',
      ],
      driveUrl: 'https://drive.google.com/file/d/1_fZajKcnqsj8YIY2_f53jbJgXVajy3tW/view?usp=drivesdk',
      videoPreviewUrl: 'https://drive.google.com/file/d/1_fZajKcnqsj8YIY2_f53jbJgXVajy3tW/preview',
      videoMeta: {
        filename: 'SOFTWARE_092_Niceday3.mov',
        sizeLabel: '149 MB',
        note: 'วิดีโอต้นฉบับจาก Google Drive · กดเล่นเมื่อพร้อมรับชม',
      },
    },
  ] as FeaturedProject[],

  skills: [
    {
      id: 'ux-ui',
      nameTh: 'ออกแบบ UX/UI',
      nameEn: 'UX/UI Design',
      description: 'ออกแบบประสบการณ์ผู้ใช้และหน้าจอให้เข้าใจง่าย ลดความซับซ้อนในทุกขั้นตอน',
      targetSectionId: 'project-pet-mood',
      relatedCategory: 'design',
    },
    {
      id: 'wireframe',
      nameTh: 'Wireframe & Prototype',
      nameEn: 'Interactive Prototyping',
      description: 'วางโครงสร้างลำดับการใช้งานและสร้างต้นแบบที่คลิกทดสอบแนวคิดได้จริง',
      targetSectionId: 'project-hiewhiw',
      relatedCategory: 'web',
    },
    {
      id: 'graphic',
      nameTh: 'ออกแบบกราฟิก',
      nameEn: 'Canva / Procreate',
      description: 'ออกแบบภาพสื่อสาร โปสเตอร์ และองค์ประกอบภาพดิจิทัลอย่างเป็นระบบ',
      targetSectionId: 'project-graphic-video',
      relatedCategory: 'design',
    },
    {
      id: 'video',
      nameTh: 'ตัดต่อวิดีโอ',
      nameEn: 'Video Editing · CapCut',
      description: 'ลำดับภาพ คุมจังหวะ และใส่องค์ประกอบโมชันเพื่อเล่าเรื่องงานไอทีให้น่าติดตาม',
      targetSectionId: 'project-graphic-video',
      relatedCategory: 'video',
    },
    {
      id: 'web-deploy',
      nameTh: 'พัฒนาเว็บต้นแบบ',
      nameEn: 'GitHub / Vercel',
      description: 'เชื่อมงานออกแบบสู่เว็บต้นแบบบนคลาวด์ด้วย GitHub และ Vercel พร้อมใช้งานจริง',
      targetSectionId: 'project-hiewhiw',
      relatedCategory: 'web',
    },
  ] as CoreSkill[],

  aboutSlides: [
    {
      id: 'owner-placeholder',
      label: 'ภาพบุคคล · เฟื่องตระกูล',
      sublabel: 'พื้นที่สำหรับภาพพอร์ตเทรตจริงของคุณเฟื่อง (Placeholder)',
      kind: 'placeholder',
      alt: 'พื้นที่สำหรับใส่ภาพพอร์ตเทรตของ นายเฟื่องตระกูล เฟื่องฟู',
      placeholderNote:
        'ยังไม่พบไฟล์ภาพพอร์ตเทรตบุคคลที่แนบมา — สามารถนำไฟล์รูปของคุณเฟื่องมาใส่ใน PORTFOLIO_DATA.aboutSlides ได้ทันที',
    },
    {
      id: 'workspace-craft',
      label: 'พื้นที่ทำงานด้านไอที',
      sublabel: 'UX/UI Wireframe · Web Prototype Workspace',
      kind: 'image',
      image: '/src/assets/images/hero_it_workspace_1795330548485.jpg',
      alt: 'บรรยากาศโต๊ะทำงานออกแบบ UX/UI และพัฒนาเว็บต้นแบบ',
    },
    {
      id: 'pet-mood-craft',
      label: 'Pet Mood Translator UI',
      sublabel: 'ผลงานออกแบบ Mobile UI จริง · IMG_7333.png',
      kind: 'image',
      image: '/assets/pet-mood-translator.png',
      alt: 'หน้าจอผลงานจริง Pet Mood Translator',
    },
  ] as CarouselSlide[],
};
