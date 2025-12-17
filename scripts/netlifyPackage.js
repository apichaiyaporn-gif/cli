import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  ClipboardList, 
  MapPin, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Printer,
  Save,
  FileText,
  Info,
  BarChart3,
  X,
  Sparkles,
  FileSpreadsheet,
  Loader2 // เพิ่มไอคอนหมุนโหลด
} from 'lucide-react';

// --- CONFIGURATION ---
// 1. URL สำหรับดูข้อมูล (Google Sheets Viewer)
const GOOGLE_SHEET_VIEW_URL = "https://docs.google.com/spreadsheets/d/1DidBgbJ1RJJMdYOphVX_3jIc2xgXkPBxfgMF_bqq80A/edit?usp=sharing";

// 2. URL สำหรับส่งข้อมูล (Google Apps Script Web App URL)
// *** นำ URL ที่ได้จากการ Deploy Apps Script มาวางแทนที่ในเครื่องหมายคำพูดด้านล่างนี้ ***
const SUBMIT_API_URL = "https://script.google.com/macros/s/AKfycbyk5mDZ9JHBupGz1r84fFwCxXIMD1LM4TCYGbfPhp8QOi3NZPIwIy2bgLY55rSFPOuWSQ/exec"; 

// --- ข้อมูลศูนย์พักพิง จ.สุรินทร์ (ข้อมูล ณ วันที่ 17 ธ.ค. 2568) ---
const SURIN_SHELTERS_DATA = {
  "เมืองสุรินทร์": [
    "อุทยานธรรมหลวงปู่ดุลย์ฯ ต.แสลงพันธ์",
    "วัดราษฎร์เจริญผล ต.แสลงพันธ์",
    "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตสุรินทร์",
    "มหาวิทยาลัยราชภัฏสุรินทร์",
    "วัดสุทธิธรรมาราม ต.นอกเมือง",
    "วัดศรีรัตนาราม ต.นอกเมือง",
    "วัดเทพสุรินทร์ ต.ในเมือง",
    "วัดเทพนิมิต ต.ตระแสง",
    "วัดทัพกระบือ ต.สำโรง",
    "ศูนย์ปฏิบัติธรรมวัดกลางบ้านละเอาะ ต.เฉนียง",
    "วัดอาโพนสุทธาวาส ต.แสลงพันธ์",
    "บ้านพักเด็กและครอบครัวจังหวัดสุรินทร์",
    "ศูนย์อบรมเยาวชนสุรินทร์",
    "วัดจุมพลสุทธาวาส ต.ในเมือง",
    "มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย",
    "วัดศรีธรรมาราม ต.นาบัว",
    "วนอุทยานพนมสวาย",
    "มูลนิธิพัฒนาอีสาน ต.ตาอ็อง"
  ],
  "ปราสาท": [
    "วัดอมรินทราวารี ต.โคกยาง",
    "โรงเรียนอมรินทราวารี ต.โคกยาง",
    "วัดสุขุมาลัย ต.บ้านไทร",
    "สุสานทุ่งมน ต.ทุ่งมน",
    "วัดราชเจริญผล ต.ประทัดบุ",
    "โรงเรียนโคกยางวิทยา ต.โคกยาง",
    "อบต.โคกยาง ต.โคกยาง",
    "โรงเรียนบ้านตาเสาะ ต.กังแอน",
    "โรงเรียนเจริญราษฎร์วิทยา ต.ประทัดบุ",
    "วิสาหกิจชุมชนผกาสะเร็น ต.กังแอน",
    "โรงเรียนบ้านสวายซอ ต.โคกยาง",
    "โรงเรียนบ้านสีโค ต.กังแอน",
    "วัดสีโควนาราม ต.กังแอน",
    "โรงเรียนบ้านโพธิ์กอง ต.เชื้อเพลิง",
    "โรงเรียนบ้านเชื้อเพลิง ต.เชื้อเพลิง",
    "วัดมุนีนิรมิตร ต.เชื้อเพลิง",
    "วัดราษฎร์บำรุงหนองซูง ต.เชื้อเพลิง",
    "วัดสิริราษฎร์บำรุง (วัดดัดสันตู๊ด) ต.โคกยาง",
    "โรงเรียนบ้านโคกบุ ต.ทมอ",
    "โรงเรียนบ้านทมอ",
    "ศูนย์โรงเรียนโสตศึกษา ต.เชื้อเพลิง",
    "ศูนย์โรงเรียนเชื้อเพลิงวิทยา ต.เชื้อเพลิง",
    "ศูนย์โรงเรียนทุ่งมนวิทยาคาร ต.ทุ่งมน",
    "ศูนย์โรงเรียนบ้านสะพานหัน ต.ทุ่งมน",
    "ศูนย์โรงเรียนบ้านคลอง ต.ปรือ",
    "ศูนย์โรงเรียนบ้านหนองหรี่ ต.ทุ่งมน",
    "ศูนย์โรงเรียนบ้านทุ่งมน ต.ทุ่งมน",
    "ศูนย์โรงเรียนบ้านสมุด ต.สมุด",
    "ศูนย์โรงเรียนบ้านหนองยาว ต.สมุด",
    "ศูนย์โรงเรียนสุววรณาคารสงเคราะห์ ต.สมุด"
  ],
  "ศีขรภูมิ": [
    "รร.ศีขรภูมิพิสัย ต.ระแงง",
    "วิทยาลัยการอาชีพศีขรภูมิ ต.ระแงง",
    "วัดปราสาท ต.ระแงง",
    "วัดศรีวิหารเจริญ ต.ระแงง",
    "วัดระแงง ต.ระแงง",
    "ศาลาประชาคม ม.5 ต.ระแงง",
    "วัดระเวียง ต.ระแงง",
    "รร.บ้านยางเตี้ย ต.ระแงง",
    "อบต.ระแงง",
    "รร.บ้านตรึม ต.ตรึม",
    "วัดบ้านตรึม ต.ตรึม",
    "รร.บ้านตรึม(ตรึมวิทยานุเคราะห์) ต.ตรึม",
    "ศูนย์พัฒนาเด็กเล็ก อบต.ตรึม",
    "วัดบ้านกาเจาะ ต.ตรึม",
    "รร.บ้านจารพัต ต.จารพัต",
    "หอประชุม อบต.จารพัต",
    "รร.บ้านพันษี ต.จารพัต",
    "รร.มัธยมจารพัตวิทยา ต.จารพัต",
    "รร.ยางวิทยาคาร ต.ยาง",
    "วัดพรมศิลาแตล ต.แตล",
    "อบต.แตล",
    "วัดปิยะธรรมาราม ต.แตล",
    "วัดบ้านหนองจิก ต.หนองบัว",
    "วัดบ้านหนองบัว ต.หนองบัว",
    "วัดบ้านโพธิ์ ต.หนองบัว",
    "ศาลาวัดบ้านโนนกลาง ต.คาละแมะ",
    "หอประชุม อบต.คาละแมะ",
    "หอประชุม รร.จารย์วิทยาคาร ต.หนองเหล็ก",
    "รร.บ้านจารย์ ต.หนองเหล็ก",
    "วัดบ้านจารย์ ต.หนองเหล็ก",
    "ศาลาประชาคมบ้านโคกลาว ต.หนองเหล็ก",
    "วัดหนองคูน้อย ต.หนองขวาว",
    "วัดบ้านขะเนก ต.หนองขวาว",
    "วัดบ้านกรวด ต.หนองขวาว",
    "วัดหนองน้ำขุ่น ต.หนองขวาว",
    "วัดนาฮัง ต.หนองขวาว",
    "วัดหนองขาม ต.หนองขวาว",
    "วัดบ้านแก ต.หนองขวาว",
    "วัดหนองเหล็ก ต.หนองขวาว",
    "วัดหนองขวาว ต.หนองขวาว",
    "หอประชุม อบต.หนองขวาว",
    "สำนักสงฆ์บ้านหนองไฮ ต.หนองขวาว",
    "รร.บ้านช่างปี่ ต.ช่างปี่",
    "วัดกระโดนค้อ ต.ช่างปี่",
    "รร.วังข่าพัฒนา",
    "วัดบ้านสมบูรณ์ ต.กุดหวาย",
    "วัดบ้านดงถาวร ต.กุดหวาย",
    "รร.กุดไผทประชาสรรค์ ต.กุดหวาย",
    "อบต.กุดหวาย",
    "วัดบ้านขวาวใหญ่ ต.ขวาวใหญ่",
    "รร.ขวาวใหญ่วิทยา ต.ขวาวใหญ่",
    "วัดบ้านหนองแรด ต.ขวาวใหญ่",
    "บ้านสำโรง ม.6 ต.ขวาวใหญ่",
    "บ้านไพรษร ม.7 ต.ขวาวใหญ่",
    "วัดทุ่งสว่างนารุ่ง ต.นารุ่ง",
    "วัดสหราชบำรุง ต.นารุ่ง",
    "วัดบ้านอาราง ต.นารุ่ง",
    "วัดบ้านตรมไพร ต.ตรมไพร",
    "ศูนย์ สกร.ต.ตรมไพร",
    "สำนักสงฆ์บ้านหนองบัวใหญ่ ต.ตรมไพร",
    "วัดผักไหม ต.ผักไหม",
    "รร.บ้านผักไหม ต.ผักไหม",
    "วัดศรีประทุมทองบ้านทุ่งบัว ต.ผักไหม",
    "รร.บ้านก้านเหลือง ต.ผักไหม",
    "วัดอัมวันวนารามบ้านทุ่งราม ต.ผักไหม",
    "ศาลาประชาคมบ้านทุ่งราม ต.ผักไหม",
    "รร.บ้านทุ่งราม ต.ผักไหม",
    "วัดพุทธขยันตี ต.ผักไหม",
    "วัดทุ่งรุง ต.ผักไหม",
    "รร.หนองแวงวิทยาคม ต.ผักไหม",
    "วัดบ้านหนองแวง ต.ผักไหม",
    "วัดดงยาง ต.ผักไหม"
  ],
  "สำโรงทาบ": [
    "อบต.ศรีสุข ต.ศรีสุข",
    "อบต.เสม็จ ต.เสม็จ",
    "วัดบ้านเสม็จ ต.เสม็จ",
    "วัดบ้านหนองม้า ต.เสม็จ",
    "วัดบ้านโนนชัย ต.เสม็จ",
    "รร.บ้านตะเคียนกูยวิทยา ต.สำโรงทาบ",
    "รร.สำโรงทาบวิทยาคม ต.สำโรงทาบ",
    "อบต.หนองไผ่ล้อม ต.หนองไผ่ล้อม",
    "อาคารแสดงสินค้า เทศบาลสำโรงทาบ",
    "วัดป่าหนองไผ่ล้อม ต.หนองไผ่ล้อม",
    "วัดบ้านหนองหว้า ต.หนองไผ่ล้อม",
    "วัดบ้านโนนลี ต.หนองไผ่ล้อม",
    "วัดบ้านโสนน้อย ต.หนองไผ่ล้อม",
    "วัดบ้านโนนสวรรค์ ต.เกาะแก้ว",
    "วัดบ้านโคกเจริญ ต.เกาะแก้ว",
    "วัดบ้านกระออม ต.กระออม",
    "วัดใหม่สูงอุดม บ้านหนองอีเลิง ต.กระออม",
    "วัดบ้านหนองฮะ ต.หนองฮะ",
    "วัดบ้านดู่โศกโคกสะอาด ต.หนองฮะ",
    "รร.บ้านขอนแก่น ต.หนองฮะ",
    "วัดบ้านค้อ ต.หนองฮะ",
    "วัดเก่าหลวงอาสน์ ต.หนองฮะ",
    "วัดป่าบ้านท่าม่วง ต.หนองฮะ",
    "วัดบ้านตลาด ต.หนองฮะ",
    "วัดป่าศิริพัฒน์ ต.หมื่นศรี",
    "วัดศรีสงวนจิต ต.หมื่นศรี",
    "วัดน้ำท่วม ต.สะโน"
  ],
  "สนม": [
    "โรงเรียนสนมศึกษาคาร",
    "โรงเรียนสนมวิทยาคาร",
    "โรงเรียนบ้านหนองอียอ",
    "โรงเรียนบ้านนาดี",
    "โรงเรียนหนองขุนศรีวิทยา",
    "โรงเรียนบ้านหัวงัว (แท่นศิลาวิทยา)",
    "วัดสว่างหนองอียอ",
    "โรงเรียนบ้านสำโรงประชารัฐ",
    "วัดป่าวิระชัยทรงเมตตาธรรม"
  ],
  "เขวาสินรินทร์": [
    "โรงเรียนสินรินทร์วิทยา",
    "วัดโพธิ์รินทร์วิเวก ต.เขวาสินรินทร์",
    "วัดศาลาเย็น ต.ตากูก",
    "วัดกะพุ่มรัตน์ ต.ตากูก",
    "วัดบูรพาราม 2 ต.ตากูก",
    "วัดดาวรุ่ง ต.ตากูก",
    "วัดปราสาททอง ต.ปราสาททอง",
    "วัดพะเนารัตนาราม ต.ปราสาททอง",
    "วัดฉันเพล ต.ปราสาททอง",
    "วัดบ้านแร่ ต.บ้านแร่",
    "วัดวิวิตวนาราม ต.บึง",
    "สำนักสงฆ์ระโงนกรอย ต.บึง",
    "วัดโพธาราม ต.บึง",
    "อบต.บ้านแร่ ต.บ้านแร่",
    "โรงเรียนอนุบาลเขวาสินรินทร์",
    "วัดนาโพธิ์ ต.เขวาสินรินทร์",
    "วัดสาริกาแก้ว ต.บึง",
    "โรงเรียนบึงนครประชาสรรค์ ต.บึง",
    "วัดสามโค ต.ปราสาททอง",
    "โรงเรียนบ้านแสรออ ต.ปราสาททอง",
    "โรงเรียนบ้านตากูก ต.ตากูก",
    "วัดปราสาทแก้ว ต.บ้านแร่"
  ],
  "ลำดวน": [
    "ศูนย์พักพิงฯ วัดป่าสุเทพวนาราม ต.ตระเปียงเตีย",
    "ศูนย์พักพิงฯ หอประชุมอำเภอลำดวน",
    "ศูนย์พักพิงฯ ศรีสุวรรณรัตนาราม",
    "ศูนย์พักพิงฯ โดม อบต.โชกเหนือ"
  ],
  "ศรีณรงค์": [
    "หอประชุมอำเภอศรีณรงค์",
    "อาคารเอนกประสงค์ อบต.ณรงค์",
    "วัดห้วยเสน ต.ณรงค์",
    "วัดพัฒนาราม ต.หนองแวง",
    "วัดป่าบ้านตรวจ ต.ตรวจ",
    "โรงเรียนวิทยาราษฎร์นุกูล ต.ศรีสุข",
    "โรงเรียนบ้านละมงค์ ต.ณรงค์",
    "โรงเรียนบ้านโสน ต.ณรงค์",
    "โรงเรียนบ้านฉลีกหนองมะแซว ต.ตรวจ",
    "โรงเรียนบ้านแดง ต.แจนแวน"
  ],
  "โนนนารายณ์": [
    "วัดป่าเมตตาสามัคคีธรรม ต.คำผง",
    "วัดบุปผาราม ต.คำผง",
    "ศาลาประชาคม บ้านขี้ตุ่น ต.โนน"
  ],
  "รัตนบุรี": [
    "วัดป่าบ้านผือ ต.รัตนบุรี",
    "วัดบ้านไผ่ ต.ไผ่"
  ],
  "ท่าตูม": [
    "วัดปทุมทอง ต.ท่าตูม",
    "วัดรัตนมงคล ต.กระโพ",
    "วัดบ้านจินดา ต.กระโพ",
    "วัดป่าท่าวังหิน ต.เมืองแก",
    "วัดบ้านปรีง ต.บะ",
    "วัดปทุมสว่าง ต.หนองเมธี",
    "ศาลาบ้านตากลาง ต.กระโพ",
    "วัดสว่างอารมณ์ ต.บัวโคก",
    "วัดศรีสว่างทุ่งโก ต.หนองเมธี",
    "วัดกาฬสราราม ต.กะโพ"
  ],
  "จอมพระ": [],
  "ชุมพลบุรี": []
};

// --- Knowledge Data (สำหรับ Info Popup) ---
const KNOWLEDGE_DATA = {
  waterSource: {
    title: "ความรู้เรื่องแหล่งน้ำสะอาด",
    content: "แหล่งน้ำดิบที่ดีควรใส ไม่มีกลิ่นเหม็น ไม่ควรอยู่ใกล้แหล่งกำจัดขยะหรือสิ่งปฏิกูล น้ำบาดาลมักจะสะอาดกว่าน้ำผิวดินแต่ควรตรวจสอบสนิมเหล็ก น้ำประปาภูมิภาคถือว่าได้มาตรฐานที่สุดในสถานการณ์ฉุกเฉิน"
  },
  treatment: {
    title: "การปรับปรุงคุณภาพน้ำเบื้องต้น",
    content: "1. การต้ม: ต้มให้น้ำเดือดอย่างน้อย 1-5 นาที ฆ่าเชื้อโรคได้ดีที่สุด\n2. คลอรีน: ใช้หยดทิพย์ (อ.32) 1 หยด ต่อน้ำ 1 ลิตร ทิ้งไว้ 30 นาทีก่อนใช้\n3. สารส้ม: แกว่งให้ตะกอนตกก่อนนำน้ำใสไปฆ่าเชื้อต่อ"
  },
  chlorine: {
    title: "ค่าคลอรีนอิสระคงเหลือ (Free Chlorine)",
    content: "ระดับที่เหมาะสมคือ 0.2 - 0.5 ppm (ส่วนในล้านส่วน)\n- น้อยกว่า 0.2 ppm: ฆ่าเชื้อโรคไม่เพียงพอ เสี่ยงท้องเสีย\n- มากกว่า 0.5 ppm: กลิ่นฉุนรุนแรง อาจระคายเคือง แต่ดื่มได้หากจำเป็น (เปิดฝาทิ้งไว้สักพัก)"
  }
};

const WaterSurveyApp = () => {
  const [formData, setFormData] = useState({
    surveyorOrg: '',
    surveyDate: new Date().toISOString().split('T')[0],
    
    location: { 
      amphoe: '', 
      moo: '', 
      tambon: '' 
    },
    centerName: '',
    generalNote: '', 
    
    placeType: '',
    placeTypeOther: '',
    informant: { name: '', position: '', phone: '' },
    residents: { total: '', kids: '', elderly: '', bedridden: '' },
    openDuration: '',
    waterSources: [],
    waterSourceOther: '',
    mainSource: '',
    usageDrinking: '',
    usageDrinkingOther: '',
    usageCooking: '',
    usageBathing: '',
    treatment: 'ไม่มี',
    treatmentMethods: [],
    treatmentOther: '',
    chlorineCheck: '',
    chlorineResult: '',
    problems: [],
    healthIssues: 'ไม่พบ',
    healthIssuesFound: [],
    healthOther: '',
    needs: [],
    needsOther: '',
    suggestion: '',
    surveyorName: '',
    surveyorPosition: ''
  });

  const [selectedCenterOption, setSelectedCenterOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State สำหรับสถานะกำลังส่ง
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal States
  const [activeInfo, setActiveInfo] = useState(null); // 'waterSource', 'treatment', 'chlorine'
  const [showSummary, setShowSummary] = useState(false);

  // Sound ref
  const audioRef = useRef(null);

  const handleChange = (e, section, field) => {
    const { value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: value }));
    }
  };

  const handleAmphoeChange = (e) => {
    const amphoe = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, amphoe: amphoe },
      centerName: ''
    }));
    setSelectedCenterOption('');
  };

  const handleCenterDropdownChange = (e) => {
    const val = e.target.value;
    setSelectedCenterOption(val);
    if (val !== 'other') {
      setFormData(prev => ({ ...prev, centerName: val }));
    } else {
      setFormData(prev => ({ ...prev, centerName: '' }));
    }
  };

  const handleManualCenterInput = (e) => {
    setFormData(prev => ({ ...prev, centerName: e.target.value }));
  };

  const handleCheckbox = (e, field) => {
    const { value, checked } = e.target;
    let updatedList = [...formData[field]];
    if (checked) {
      updatedList.push(value);
    } else {
      updatedList = updatedList.filter(item => item !== value);
    }
    setFormData(prev => ({ ...prev, [field]: updatedList }));
  };

  // Helper function to calculate risk for dashboard
  const calculateRisk = () => {
    let risk = 0;
    let messages = [];

    // Factor 1: Source
    if (formData.mainSource === 'น้ำผิวดิน') {
      risk += 30;
      messages.push("ใช้น้ำผิวดินเป็นแหล่งหลัก (เสี่ยงสูง)");
    }

    // Factor 2: Treatment
    if (formData.treatment === 'ไม่มี') {
      risk += 40;
      messages.push("ไม่มีการปรับปรุงคุณภาพน้ำ");
    }

    // Factor 3: Chlorine
    if (formData.chlorineResult === 'low' || formData.chlorineResult === 'unknown' || formData.chlorineCheck === 'ไม่เคยตรวจ') {
      risk += 20;
      messages.push("คลอรีนไม่เพียงพอหรือไม่ทราบค่า");
    }

    // Factor 4: Health Issues
    if (formData.healthIssues === 'พบ') {
      risk += 10; // Found issues increases risk concern
      messages.push("พบผู้ป่วยที่เกี่ยวข้องกับน้ำ");
    }

    let level = "ต่ำ";
    let color = "text-green-600";
    if (risk > 30) { level = "ปานกลาง"; color = "text-orange-500"; }
    if (risk > 60) { level = "สูง"; color = "text-red-600"; }

    return { score: risk, level, color, messages };
  };

  const riskData = calculateRisk();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Check if API URL is set
    if (SUBMIT_API_URL === "วาง_WEB_APP_URL_ที่นี่" || !SUBMIT_API_URL) {
      alert("กรุณาตั้งค่า Web App URL ในโค้ดก่อนใช้งาน (บรรทัดที่ 21)");
      return;
    }

    setIsSubmitting(true);
    
    // Prepare Data Payload with Risk calculation
    const payload = {
      ...formData,
      riskLevel: riskData.level,
      riskScore: riskData.score
    };

    try {
      // Send data to Google Apps Script
      // Note: We use mode: 'no-cors' because GAS redirects can cause CORS errors in fetch. 
      // This means we won't see the response content, but it will submit.
      await fetch(SUBMIT_API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // If successful (or sent without error)
      setSubmitted(true);
      setShowConfetti(true);
      setShowSummary(true);
      
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }

      setTimeout(() => setShowConfetti(false), 5000);

    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMsg("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาตรวจสอบอินเทอร์เน็ต");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleOpenSheets = () => {
    window.open(GOOGLE_SHEET_VIEW_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-yellow-50 font-sans text-slate-800 pb-12 print:bg-white print:p-0 relative overflow-x-hidden">
      
      {/* Sound Effect (Hidden) */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..." />

      {/* Confetti Effect Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-transparent">
             <div className="absolute top-0 left-1/4 animate-bounce text-4xl">✨</div>
             <div className="absolute top-10 right-1/4 animate-bounce delay-100 text-4xl">🎉</div>
             <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-200 text-4xl">🎊</div>
             <div className="absolute top-1/2 right-1/3 animate-bounce delay-300 text-4xl">⭐</div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full animate-pulse bg-gradient-to-r from-yellow-200/20 via-orange-200/20 to-pink-200/20"></div>
             </div>
          </div>
        </div>
      )}

      {/* Info Popup Modal */}
      {activeInfo && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl relative border-4 border-orange-200">
            <button 
              onClick={() => setActiveInfo(null)}
              className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Info size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{KNOWLEDGE_DATA[activeInfo].title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {KNOWLEDGE_DATA[activeInfo].content}
            </p>
            <button 
              onClick={() => setActiveInfo(null)}
              className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}

      {/* Summary Popup Modal (After Submit) */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-xl max-w-2xl w-full p-0 shadow-2xl overflow-hidden relative">
            <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="animate-bounce" /> บันทึกข้อมูลสำเร็จ!
              </h2>
              <button onClick={() => setShowSummary(false)}><X className="text-white/80 hover:text-white" /></button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-3 shadow-inner">
                  <Sparkles className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">ขอบคุณสำหรับการรายงาน</h3>
                <p className="text-slate-500">ข้อมูลของคุณถูกส่งไปยัง Google Sheets เรียบร้อยแล้ว</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <h4 className="font-bold text-orange-800 mb-2 border-b border-orange-200 pb-2">สรุปข้อมูลสำคัญ</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">วันที่:</span> {formData.surveyDate}</div>
                  <div><span className="font-semibold">สถานที่:</span> {formData.centerName}</div>
                  <div><span className="font-semibold">ผู้รายงาน:</span> {formData.surveyorName}</div>
                  <div><span className="font-semibold">ผลประเมินความเสี่ยง:</span> <span className={riskData.color}>{riskData.level}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex flex-wrap justify-end gap-3">
              <button 
                onClick={handleOpenSheets}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg font-semibold text-green-800 transition border border-green-200"
              >
                <FileSpreadsheet size={18} /> เปิด Google Sheets
              </button>
              <button 
                onClick={() => { setShowSummary(false); handlePrint(); }} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-semibold text-slate-700 transition"
              >
                <Printer size={18} /> พิมพ์ใบสรุป
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-white transition shadow-lg hover:shadow-orange-500/30"
              >
                เสร็จสิ้น / กรอกใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar / Header */}
      <header className="bg-orange-800 text-white shadow-xl print:hidden sticky top-0 z-40 border-b-4 border-orange-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full shadow-inner">
              <Droplets className="h-6 w-6 text-yellow-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight drop-shadow-sm">ระบบสำรวจสุขาภิบาลน้ำ</h1>
              <p className="text-xs text-orange-200 font-medium">ศูนย์อพยพ/ศูนย์พักพิง จ.สุรินทร์</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleOpenSheets}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm transition border border-green-500 shadow-md"
            >
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Google Sheets</span>
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-orange-700/50 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm transition border border-orange-600/30 shadow-md"
            >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">พิมพ์ฟอร์ม</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto mt-6 px-4 pb-20 print:mt-0 print:px-0 print:max-w-none">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Document Header (Visible in Print) */}
          <div className="bg-orange-50 p-8 rounded-xl shadow-md border-2 border-orange-200 print:shadow-none print:border-none print:p-0 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-xl print:hidden"></div>
            
            <div className="text-center border-b-2 border-orange-200 pb-6 mb-6 relative z-10">
              <h2 className="text-3xl font-bold text-orange-900 print:text-black tracking-tight">แบบสำรวจการใช้น้ำและคุณภาพน้ำ</h2>
              <h3 className="text-lg font-semibold text-orange-700 print:text-black mt-1">ในศูนย์อพยพ / ศูนย์พักพิง จังหวัดสุรินทร์</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-1">หน่วยงานผู้รับผิดชอบ</label>
                <input 
                  type="text" 
                  name="surveyorOrg"
                  value={formData.surveyorOrg}
                  onChange={(e) => handleChange(e)}
                  className="input-field-rose print:border-none print:bg-transparent"
                  placeholder="ระบุชื่อหน่วยงาน"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-1">วันที่สำรวจ</label>
                <input 
                  type="date" 
                  name="surveyDate"
                  value={formData.surveyDate}
                  onChange={(e) => handleChange(e)}
                  className="input-field-rose"
                  required
                />
              </div>
            </div>
          </div>

          {/* Part 1: General Info (Updated with Manual Input) */}
          <Section title="ตอนที่ 1 ข้อมูลทั่วไปของศูนย์พักพิง" icon={<MapPin />}>
            <div className="space-y-4">
              
              <div className="bg-orange-100/50 p-4 rounded-lg border border-orange-200">
                <label className="label mb-2 block text-orange-900">1. ระบุอำเภอที่ตั้งศูนย์พักพิง</label>
                <select 
                  className="input-field-rose font-semibold" 
                  value={formData.location.amphoe} 
                  onChange={handleAmphoeChange}
                  required
                >
                  <option value="">-- กรุณาเลือกอำเภอ --</option>
                  {Object.keys(SURIN_SHELTERS_DATA).map(amphoe => (
                    <option key={amphoe} value={amphoe}>{amphoe}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white/80 p-4 rounded-lg border border-orange-100 shadow-sm">
                <label className="label mb-2 block text-orange-900">2. ชื่อศูนย์อพยพ / ศูนย์พักพิง</label>
                <select 
                  className="input-field-rose mb-2" 
                  value={selectedCenterOption}
                  onChange={handleCenterDropdownChange}
                  disabled={!formData.location.amphoe}
                  required
                >
                  <option value="">
                    {formData.location.amphoe ? `-- เลือกศูนย์ในอำเภอ${formData.location.amphoe} --` : "-- กรุณาเลือกอำเภอก่อน --"}
                  </option>
                  {formData.location.amphoe && SURIN_SHELTERS_DATA[formData.location.amphoe]?.map((center, idx) => (
                    <option key={idx} value={center}>{center}</option>
                  ))}
                  <option value="other" className="font-bold text-orange-700">+ อื่นๆ (ระบุชื่อเอง)</option>
                </select>

                {selectedCenterOption === 'other' && (
                  <div className="animate-fade-in mt-2">
                    <label className="text-xs text-orange-600 mb-1 block font-bold">ระบุชื่อศูนย์พักพิงเพิ่มเติม:</label>
                    <input 
                      type="text" 
                      className="input-field-rose border-orange-400 ring-2 ring-orange-100"
                      placeholder="พิมพ์ชื่อศูนย์พักพิง..."
                      value={formData.centerName}
                      onChange={handleManualCenterInput}
                      required
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">ตำบล</label>
                  <input type="text" className="input-field-rose" placeholder="ระบุตำบล" value={formData.location.tambon} onChange={(e) => handleChange(e, 'location', 'tambon')} />
                </div>
                <div>
                  <label className="label">หมู่ที่</label>
                  <input type="text" className="input-field-rose" placeholder="-" value={formData.location.moo} onChange={(e) => handleChange(e, 'location', 'moo')} />
                </div>
              </div>
              
              <div>
                <label className="label mb-2 block">ประเภทสถานที่</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['โรงเรียน', 'วัด', 'อาคารราชการ'].map((type) => (
                    <label key={type} className="radio-card">
                      <input 
                        type="radio" 
                        name="placeType" 
                        value={type} 
                        checked={formData.placeType === type}
                        onChange={(e) => handleChange(e)}
                        className="mr-2 accent-orange-600"
                      />
                      {type}
                    </label>
                  ))}
                  <label className="radio-card flex-col md:flex-row items-start md:items-center">
                    <div className="flex items-center mb-2 md:mb-0">
                      <input 
                        type="radio" 
                        name="placeType" 
                        value="other" 
                        checked={formData.placeType === 'other'}
                        onChange={(e) => handleChange(e)}
                        className="mr-2 accent-orange-600"
                      />
                      <span>อื่น ๆ</span>
                    </div>
                    {formData.placeType === 'other' && (
                      <input 
                        type="text" 
                        placeholder="ระบุ"
                        value={formData.placeTypeOther}
                        onChange={(e) => setFormData({...formData, placeTypeOther: e.target.value})}
                        className="ml-0 md:ml-2 border-b border-orange-300 outline-none text-sm w-full bg-transparent"
                      />
                    )}
                  </label>
                </div>
              </div>

              {/* Informant Info */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 drop-shadow" /> ผู้ให้ข้อมูล
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="ชื่อ-สกุล" 
                    className="input-field-rose" 
                    value={formData.informant.name}
                    onChange={(e) => handleChange(e, 'informant', 'name')}
                  />
                   <input 
                    type="text" 
                    placeholder="ตำแหน่ง" 
                    className="input-field-rose" 
                    value={formData.informant.position}
                    onChange={(e) => handleChange(e, 'informant', 'position')}
                  />
                   <input 
                    type="tel" 
                    placeholder="เบอร์โทรศัพท์" 
                    className="input-field-rose md:col-span-2" 
                    value={formData.informant.phone}
                    onChange={(e) => handleChange(e, 'informant', 'phone')}
                  />
                </div>
              </div>

              {/* Added Manual Input Space */}
              <div className="pt-4 border-t border-orange-200/50">
                 <label className="label mb-2 block text-orange-900">ข้อมูลทั่วไปเพิ่มเติม (ถ้ามี)</label>
                 <textarea 
                    className="input-field-rose h-20"
                    placeholder="กรอกข้อมูลอื่นๆ เพิ่มเติมเกี่ยวกับสถานที่..."
                    value={formData.generalNote}
                    onChange={(e) => setFormData({...formData, generalNote: e.target.value})}
                 ></textarea>
              </div>

            </div>
          </Section>

          {/* Part 2: Residents */}
          <Section title="ตอนที่ 2 ข้อมูลผู้อาศัยในศูนย์" icon={<Users />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">จำนวนผู้อพยพทั้งหมด (คน)</label>
                <input type="number" className="input-field-rose text-lg font-bold text-orange-800" value={formData.residents.total} onChange={(e) => handleChange(e, 'residents', 'total')} />
              </div>
              <div>
                <label className="label">ระยะเวลาที่เปิดศูนย์</label>
                 <select className="input-field-rose" name="openDuration" value={formData.openDuration} onChange={(e) => handleChange(e)}>
                  <option value="">-- เลือกช่วงเวลา --</option>
                  <option value="<3">น้อยกว่า 3 วัน</option>
                  <option value="3-7">3 – 7 วัน</option>
                  <option value=">7">มากกว่า 7 วัน</option>
                 </select>
              </div>
            </div>
            <div className="mt-4 border-t border-orange-100 pt-4">
              <p className="label mb-3 text-orange-900">กลุ่มเปราะบาง (ระบุจำนวน)</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 shadow-sm">
                    <label className="text-xs font-bold text-rose-800 block mb-1">เด็กอายุต่ำกว่า 5 ปี</label>
                    <input type="number" className="w-full p-2 rounded border border-rose-200 bg-white" placeholder="0" value={formData.residents.kids} onChange={(e) => handleChange(e, 'residents', 'kids')} />
                 </div>
                 <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm">
                    <label className="text-xs font-bold text-yellow-800 block mb-1">ผู้สูงอายุ</label>
                    <input type="number" className="w-full p-2 rounded border border-yellow-200 bg-white" placeholder="0" value={formData.residents.elderly} onChange={(e) => handleChange(e, 'residents', 'elderly')} />
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                    <label className="text-xs font-bold text-slate-800 block mb-1">ผู้ป่วยติดเตียง/พิการ</label>
                    <input type="number" className="w-full p-2 rounded border border-slate-200 bg-white" placeholder="0" value={formData.residents.bedridden} onChange={(e) => handleChange(e, 'residents', 'bedridden')} />
                 </div>
              </div>
            </div>
          </Section>

          {/* Part 3: Water Sources (With Info Icon) */}
          <Section title="ตอนที่ 3 แหล่งน้ำที่ใช้ในศูนย์พักพิง" icon={<Droplets />}>
            <div className="mb-6 relative">
              <div className="flex items-center justify-between mb-2">
                 <label className="label block">แหล่งน้ำที่ใช้ในศูนย์ (เลือกได้มากกว่า 1 ข้อ)</label>
                 <button type="button" onClick={() => setActiveInfo('waterSource')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full border border-blue-200 shadow-sm transition transform hover:scale-105">
                    <Info size={14} /> ความรู้เรื่องแหล่งน้ำ
                 </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'ประปาการประปาส่วนภูมิภาค', 
                  'ประปาหมู่บ้าน', 
                  'บ่อบาดาล', 
                  'แหล่งน้ำผิวดิน (แม่น้ำ/ลำห้วย)',
                  'น้ำดื่มบรรจุถัง / น้ำดื่มแจก'
                ].map((source) => (
                  <label key={source} className="flex items-center p-3 border border-orange-100 bg-white rounded-lg hover:bg-orange-50 cursor-pointer shadow-sm transition">
                    <input 
                      type="checkbox" 
                      value={source} 
                      checked={formData.waterSources.includes(source)}
                      onChange={(e) => handleCheckbox(e, 'waterSources')}
                      className="h-5 w-5 text-orange-600 rounded mr-3 accent-orange-600"
                    />
                    <span className="text-sm">{source}</span>
                  </label>
                ))}
                 <label className="flex items-center p-3 border border-orange-100 bg-white rounded-lg hover:bg-orange-50 cursor-pointer shadow-sm transition">
                    <input 
                      type="checkbox" 
                      value="other"
                      checked={formData.waterSources.includes('other')}
                      onChange={(e) => handleCheckbox(e, 'waterSources')}
                      className="h-5 w-5 text-orange-600 rounded mr-3 accent-orange-600"
                    />
                    <span className="text-sm mr-2">อื่น ๆ</span>
                    <input 
                      type="text" 
                      className="border-b border-orange-300 outline-none text-sm flex-1 bg-transparent" 
                      placeholder="ระบุ"
                      disabled={!formData.waterSources.includes('other')}
                      value={formData.waterSourceOther}
                      onChange={(e) => setFormData({...formData, waterSourceOther: e.target.value})}
                    />
                  </label>
              </div>
            </div>
            
            <div>
              <label className="label mb-2 block">แหล่งน้ำหลักที่ใช้มากที่สุด</label>
              <div className="flex flex-wrap gap-4">
                {['ประปา', 'บ่อบาดาล', 'น้ำผิวดิน', 'น้ำบรรจุถัง'].map((main) => (
                  <label key={main} className="radio-pill cursor-pointer">
                    <input 
                      type="radio" 
                      name="mainSource" 
                      value={main} 
                      checked={formData.mainSource === main}
                      onChange={(e) => handleChange(e)}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 rounded-full border text-sm transition font-medium shadow-sm ${formData.mainSource === main ? 'bg-orange-600 text-white border-orange-600 shadow-orange-300 ring-2 ring-orange-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-orange-50'}`}>
                      {main}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* Part 4: Usage */}
          <Section title="ตอนที่ 4 การใช้น้ำในกิจกรรมต่าง ๆ" icon={<Activity />}>
            <div className="space-y-6">
              <UsageGroup 
                title="น้ำที่ใช้สำหรับการดื่ม" 
                options={['น้ำดื่มบรรจุขวด/ถัง', 'น้ำประปาต้มสุก', 'น้ำประปาผ่านเครื่องกรอง', 'อื่น ๆ']} 
                name="usageDrinking"
                selected={formData.usageDrinking}
                onChange={(e) => handleChange(e)}
                otherValue={formData.usageDrinkingOther}
                onOtherChange={(val) => setFormData({...formData, usageDrinkingOther: val})}
              />
              <UsageGroup 
                title="น้ำที่ใช้สำหรับการประกอบอาหาร" 
                options={['น้ำประปา', 'น้ำบาดาล', 'น้ำผิวดิน']} 
                name="usageCooking"
                selected={formData.usageCooking}
                onChange={(e) => handleChange(e)}
              />
              <UsageGroup 
                title="น้ำที่ใช้สำหรับอาบน้ำ / ซักล้าง" 
                options={['น้ำประปา', 'น้ำบาดาล', 'น้ำผิวดิน']} 
                name="usageBathing"
                selected={formData.usageBathing}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Section>

          {/* Part 5: Quality Control (With Info Icon) */}
          <Section title="ตอนที่ 5 การจัดการและควบคุมคุณภาพน้ำ" icon={<ClipboardList />}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                 <label className="label block">การปรับปรุงคุณภาพน้ำก่อนนำมาใช้</label>
                 <button type="button" onClick={() => setActiveInfo('treatment')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full border border-blue-200 shadow-sm transition transform hover:scale-105">
                    <Info size={14} /> วิธีปรับปรุงน้ำ
                 </button>
              </div>

              <div className="flex gap-4 mb-3">
                <label className="radio-card">
                  <input type="radio" name="treatment" value="ไม่มี" checked={formData.treatment === 'ไม่มี'} onChange={(e) => handleChange(e)} className="mr-2 accent-orange-600" /> ไม่มี
                </label>
                <label className="radio-card">
                  <input type="radio" name="treatment" value="มี" checked={formData.treatment === 'มี'} onChange={(e) => handleChange(e)} className="mr-2 accent-orange-600" /> มี
                </label>
              </div>
              
              {formData.treatment === 'มี' && (
                <div className="pl-6 border-l-4 border-orange-300 ml-2 animate-fade-in py-2 bg-orange-50/50 rounded-r-lg">
                  <p className="text-sm text-orange-800 font-bold mb-2">เลือกวิธีปรับปรุง (เลือกได้มากกว่า 1 ข้อ)</p>
                  <div className="flex flex-wrap gap-3">
                    {['ต้ม', 'ใส่คลอรีน', 'เครื่องกรองน้ำ'].map((method) => (
                      <label key={method} className="flex items-center px-3 py-2 border border-orange-200 rounded-lg bg-white shadow-sm hover:bg-orange-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          value={method} 
                          checked={formData.treatmentMethods.includes(method)}
                          onChange={(e) => handleCheckbox(e, 'treatmentMethods')}
                          className="mr-2 accent-orange-600"
                        />
                        {method}
                      </label>
                    ))}
                    <label className="flex items-center px-3 py-2 border border-orange-200 rounded-lg bg-white shadow-sm hover:bg-orange-50 cursor-pointer">
                        <span className="mr-2 text-sm">อื่น ๆ</span>
                        <input type="text" className="border-b border-orange-300 text-sm outline-none bg-transparent" 
                           value={formData.treatmentOther} 
                           onChange={(e) => setFormData({...formData, treatmentOther: e.target.value})}
                        />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-100/50 p-4 rounded-lg border border-orange-200">
              <div>
                <label className="label mb-2 block">การตรวจสอบคลอรีนอิสระคงเหลือ</label>
                <select name="chlorineCheck" className="input-field-rose" value={formData.chlorineCheck} onChange={(e) => handleChange(e)}>
                  <option value="">-- กรุณาเลือก --</option>
                  <option value="ไม่เคยตรวจ">ไม่เคยตรวจ</option>
                  <option value="ครั้งคราว">ตรวจเป็นครั้งคราว</option>
                  <option value="ประจำ">ตรวจเป็นประจำ</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="label block">ผลการตรวจ (ถ้ามี)</label>
                   <button type="button" onClick={() => setActiveInfo('chlorine')} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs font-bold">
                      <Info size={14} /> ค่ามาตรฐาน?
                   </button>
                </div>
                <select name="chlorineResult" className="input-field-rose" value={formData.chlorineResult} onChange={(e) => handleChange(e)} disabled={formData.chlorineCheck === 'ไม่เคยตรวจ' || formData.chlorineCheck === ''}>
                  <option value="">-- กรุณาเลือก --</option>
                  <option value="normal">0.2 – 0.5 ppm (เกณฑ์มาตรฐาน)</option>
                  <option value="low">ต่ำกว่า 0.2 ppm</option>
                  <option value="high">มากกว่า 0.5 ppm</option>
                  <option value="unknown">ไม่ทราบผล</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Part 6: Problems & Risks */}
          <Section title="ตอนที่ 6 ปัญหาและความเสี่ยงด้านน้ำ" icon={<AlertTriangle className="text-red-500" />}>
            <div className="mb-6">
              <label className="label mb-2 block">ปัญหาที่พบเกี่ยวกับน้ำ (เลือกได้มากกว่า 1 ข้อ)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['น้ำขุ่น', 'มีกลิ่น', 'สีผิดปกติ', 'ปริมาณไม่เพียงพอ', 'ไม่พบปัญหา'].map((prob) => (
                  <label key={prob} className={`flex items-center p-3 border rounded-lg cursor-pointer transition shadow-sm ${prob === 'ไม่พบปัญหา' ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-white border-orange-100 hover:bg-orange-50'}`}>
                    <input 
                      type="checkbox" 
                      value={prob}
                      checked={formData.problems.includes(prob)}
                      onChange={(e) => handleCheckbox(e, 'problems')}
                      className={`h-5 w-5 rounded mr-3 ${prob === 'ไม่พบปัญหา' ? 'accent-green-600' : 'accent-orange-600'}`}
                    />
                    <span className="text-sm font-medium">{prob}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
               <label className="label mb-2 block">พบผู้ป่วยที่อาจเกี่ยวข้องกับการใช้น้ำหรือไม่</label>
               <div className="flex gap-4 mb-3">
                  <label className="radio-card">
                    <input type="radio" name="healthIssues" value="ไม่พบ" checked={formData.healthIssues === 'ไม่พบ'} onChange={(e) => handleChange(e)} className="mr-2 accent-green-600" /> ไม่พบ
                  </label>
                  <label className="radio-card border-red-200 hover:bg-red-50">
                    <input type="radio" name="healthIssues" value="พบ" checked={formData.healthIssues === 'พบ'} onChange={(e) => handleChange(e)} className="mr-2 accent-red-600" /> พบ
                  </label>
               </div>
               {formData.healthIssues === 'พบ' && (
                  <div className="pl-6 border-l-4 border-red-300 ml-2 animate-fade-in bg-red-50 p-4 rounded-r-lg">
                    <p className="text-sm font-bold text-red-800 mb-2">ระบุอาการที่พบ (เลือกได้มากกว่า 1 ข้อ)</p>
                    <div className="flex flex-wrap gap-3">
                      {['ท้องเสีย', 'อาเจียน', 'ผื่นคัน'].map((sym) => (
                        <label key={sym} className="flex items-center px-3 py-2 border border-red-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-red-50">
                          <input type="checkbox" value={sym} checked={formData.healthIssuesFound.includes(sym)} onChange={(e) => handleCheckbox(e, 'healthIssuesFound')} className="mr-2 accent-red-600" />
                          {sym}
                        </label>
                      ))}
                       <label className="flex items-center px-3 py-2 border border-red-200 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-red-50">
                          <span className="mr-2 text-sm">อื่น ๆ</span>
                          <input type="text" className="border-b border-red-300 text-sm outline-none bg-transparent" 
                             value={formData.healthOther}
                             onChange={(e) => setFormData({...formData, healthOther: e.target.value})}
                          />
                      </label>
                    </div>
                  </div>
               )}
            </div>
          </Section>

          {/* Part 7: Needs & Suggestions */}
          <Section title="ตอนที่ 7 ความต้องการและข้อเสนอแนะ" icon={<FileText />}>
             <div className="mb-6">
               <label className="label mb-2 block">ต้องการการสนับสนุนด้านใดบ้าง</label>
               <div className="space-y-2">
                  {['น้ำดื่มสะอาด', 'คลอรีน / สารฆ่าเชื้อ', 'ชุดตรวจคุณภาพน้ำ', 'คำแนะนำด้านสุขาภิบาลน้ำ'].map((need) => (
                    <label key={need} className="flex items-center p-2 hover:bg-white/50 rounded transition">
                      <input type="checkbox" value={need} checked={formData.needs.includes(need)} onChange={(e) => handleCheckbox(e, 'needs')} className="h-4 w-4 accent-orange-600 rounded mr-3" />
                      <span className="text-slate-700 font-medium">{need}</span>
                    </label>
                  ))}
                  <label className="flex items-center p-2 hover:bg-white/50 rounded transition">
                     <input type="checkbox" value="other" checked={formData.needs.includes('other')} onChange={(e) => handleCheckbox(e, 'needs')} className="h-4 w-4 accent-orange-600 rounded mr-3" />
                     <span className="mr-2 text-slate-700 font-medium">อื่น ๆ</span>
                     <input type="text" className="border-b border-orange-300 outline-none text-sm w-full md:w-1/2 bg-transparent" value={formData.needsOther} onChange={(e) => setFormData({...formData, needsOther: e.target.value})} disabled={!formData.needs.includes('other')} />
                  </label>
               </div>
             </div>

             <div>
                <label className="label block mb-2">ข้อเสนอแนะเพิ่มเติม</label>
                <textarea 
                  className="input-field-rose h-24"
                  placeholder="ระบุข้อเสนอแนะ..."
                  value={formData.suggestion}
                  onChange={(e) => setFormData({...formData, suggestion: e.target.value})}
                ></textarea>
             </div>
          </Section>

          {/* Part 8: Dashboard (New Section) */}
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg border-2 border-slate-600 mb-6 break-inside-avoid relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 size={100} />
             </div>
             
             <div className="flex items-center gap-3 border-b border-slate-600 pb-4 mb-4 relative z-10">
               <div className="p-2 bg-slate-700 rounded-lg text-yellow-400 shadow-inner">
                 <Activity className="h-6 w-6" />
               </div>
               <h3 className="text-lg font-bold text-yellow-100">ตอนที่ 8 สรุปสถานะเฝ้าระวัง (Dashboard)</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Risk Meter */}
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 backdrop-blur-sm">
                   <h4 className="text-sm font-semibold text-slate-300 mb-2">ระดับความเสี่ยง (ประเมินเบื้องต้น)</h4>
                   <div className="flex items-end gap-2 mb-2">
                      <span className={`text-4xl font-black ${riskData.score > 60 ? 'text-red-400' : riskData.score > 30 ? 'text-orange-400' : 'text-green-400'}`}>
                        {riskData.level}
                      </span>
                      <span className="text-xs text-slate-400 mb-1">คะแนนความเสี่ยง: {riskData.score}%</span>
                   </div>
                   <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${riskData.score > 60 ? 'bg-red-500' : riskData.score > 30 ? 'bg-orange-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.max(5, riskData.score)}%` }}
                      ></div>
                   </div>
                </div>

                {/* Key Indicators */}
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 backdrop-blur-sm">
                   <h4 className="text-sm font-semibold text-slate-300 mb-3">ปัจจัยเสี่ยงที่พบ</h4>
                   {riskData.messages.length > 0 ? (
                     <ul className="space-y-2">
                       {riskData.messages.map((msg, i) => (
                         <li key={i} className="flex items-center text-xs text-red-200">
                           <AlertTriangle size={12} className="mr-2 text-red-400" /> {msg}
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <div className="flex items-center text-green-300 gap-2 h-full">
                        <CheckCircle2 size={20} /> ไม่พบปัจจัยเสี่ยงหลัก
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Signature Section */}
          <div className="bg-orange-50 p-6 rounded-xl shadow-md border-2 border-orange-200 mt-8 break-inside-avoid">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="pt-8">
                   <label className="label block mb-2 text-orange-900">ผู้สำรวจ (ลงชื่อ)</label>
                   <input type="text" className="input-field-rose" placeholder="ลงชื่อผู้สำรวจ" value={formData.surveyorName} onChange={(e) => setFormData({...formData, surveyorName: e.target.value})} required />
                </div>
                <div className="pt-8">
                   <label className="label block mb-2 text-orange-900">ตำแหน่ง</label>
                   <input type="text" className="input-field-rose" placeholder="ระบุตำแหน่ง" value={formData.surveyorPosition} onChange={(e) => setFormData({...formData, surveyorPosition: e.target.value})} required />
                </div>
             </div>
          </div>

          {/* Footer Action */}
          <div className="flex justify-end gap-4 pt-4 print:hidden">
            <button 
              type="button" 
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl bg-orange-100 text-orange-800 font-bold hover:bg-orange-200 transition flex items-center gap-2 border border-orange-200 shadow-sm"
              disabled={isSubmitting}
            >
              <Printer className="h-5 w-5 drop-shadow-sm" /> พิมพ์แบบร่าง
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-orange-500/40 transition flex items-center gap-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 drop-shadow-md" />} 
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'บันทึกข้อมูล'}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-center font-bold mt-2">{errorMsg}</p>}

        </form>
      </main>

      {/* Footer Copyright */}
      <footer className="mt-12 text-center text-orange-400 text-sm pb-8 print:hidden">
        <p>© 2025 ระบบฐานข้อมูลสุขาภิบาลน้ำเพื่อการช่วยเหลือผู้ประสบภัย</p>
      </footer>

      {/* CSS Styles */}
      <style>{`
        /* Custom Input Style (Rose/Old Rose) */
        .input-field-rose {
          @apply w-full p-2 border border-rose-200 bg-[#FFF1F2] rounded-md focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition text-slate-800 placeholder-rose-300;
        }
        
        /* Label Style */
        .label {
          @apply text-sm font-bold text-slate-700;
        }
        
        /* Card Style */
        .radio-card {
          @apply flex items-center p-3 border border-orange-100 bg-white rounded-lg hover:bg-orange-50 cursor-pointer transition shadow-sm;
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; background: white; }
          .no-print { display: none; }
          input, textarea, select { border: none !important; background: transparent !important; resize: none; box-shadow: none !important; }
          .input-field-rose { background: transparent; border-bottom: 1px solid #ccc; border-radius: 0; padding-left: 0; }
          input[type="checkbox"], input[type="radio"] { -webkit-appearance: none; appearance: none; border: 1px solid #000; width: 12px; height: 12px; display: inline-block; margin-right: 5px; }
          input[type="checkbox"]:checked, input[type="radio"]:checked { background: #000; }
        }
      `}</style>
    </div>
  );
};

// Reusable Section Component (Orange/Seasad Theme)
const Section = ({ title, icon, children }) => (
  <div className="bg-orange-50 p-6 rounded-xl shadow-md border-2 border-orange-200 mb-6 break-inside-avoid hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-3 border-b-2 border-orange-100 pb-4 mb-4">
      <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shadow-inner">
        {React.cloneElement(icon, { className: "h-6 w-6 drop-shadow-sm" })}
      </div>
      <h3 className="text-lg font-bold text-orange-900">{title}</h3>
    </div>
    {children}
  </div>
);

// Reusable Usage Group Component
const UsageGroup = ({ title, options, name, selected, onChange, otherValue, onOtherChange }) => (
  <div className="pb-4 border-b border-orange-100 last:border-0 last:pb-0">
    <label className="label mb-2 block text-orange-800">{title}</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const isOther = opt.includes('อื่น ๆ');
        const val = isOther ? 'other' : opt;
        return (
          <label key={opt} className={`radio-card ${selected === val ? 'bg-orange-100 border-orange-300 ring-1 ring-orange-200' : ''}`}>
             <input 
              type="radio" 
              name={name} 
              value={val} 
              checked={selected === val}
              onChange={onChange}
              className="mr-2 accent-orange-600" 
            />
            {isOther ? (
              <div className="flex items-center w-full">
                <span className="mr-2">อื่น ๆ</span>
                {selected === 'other' && onOtherChange && (
                   <input 
                    type="text" 
                    className="border-b border-orange-300 bg-transparent text-sm outline-none w-full placeholder-orange-300"
                    placeholder="ระบุ"
                    value={otherValue}
                    onChange={(e) => onOtherChange(e.target.value)}
                   />
                )}
              </div>
            ) : (
              <span>{opt}</span>
            )}
          </label>
        );
      })}
    </div>
  </div>
);

export default WaterSurveyApp;
