import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const projects = [
  {
    id: 'dqm',
    title: 'Data Quality Management System',
    subtitle: 'รับไฟล์ ตรวจสอบคุณภาพข้อมูล และส่งต่อข้อมูลที่พร้อมใช้งาน',
    file: '/dqm.html',
    image: '/assets/diagrams/dqm.png',
    stack: ['CloverDX', 'PostgreSQL', 'FTP/SFTP', 'Data Quality Rules', 'KPI'],
    overview:
      'ระบบนี้รับไฟล์จากหลายแหล่ง ตรวจสอบข้อมูลก่อนนำไปใช้งานจริง แยกข้อมูลระหว่างทางออกจากข้อมูลที่ผ่านการตรวจสอบแล้ว และส่งผลต่อให้รายงานหรือระบบปลายทาง',
    sections: [
      ['Input', 'รับไฟล์จากระบบต้นทางและข้อมูลอ้างอิงผ่าน FTP/SFTP'],
      ['Processing', 'CloverDX ตรวจไฟล์ แปลงข้อมูล ตรวจตามกฎ และควบคุมการโหลดข้อมูล'],
      ['Data', 'เก็บข้อมูลดิบไว้ใน Staging และเก็บเฉพาะข้อมูลที่ผ่านการตรวจสอบไว้ในฐานข้อมูลกลาง'],
      ['Output', 'รายงานและ Dashboard ดึงข้อมูลจากฐานข้อมูลกลางไปใช้งาน']
    ],
    flows: ['รับไฟล์เข้า', 'โหลดเข้า Staging', 'ตรวจสอบคุณภาพข้อมูล', 'จัดเก็บฐานข้อมูลกลาง', 'ติดตามผลและดูแลระบบ']
  },
  {
    id: 'goanywhere',
    title: 'GoAnywhere MFT',
    subtitle: 'รับส่งไฟล์ระหว่างระบบแบบปลอดภัย พร้อมทำงานอัตโนมัติและตรวจสอบย้อนหลังได้',
    file: '/goanywhere.html',
    image: '/assets/diagrams/goanywhere.png',
    stack: ['GoAnywhere MFT', 'SFTP', 'SSH Key', 'Trigger', 'ETL'],
    overview:
      'ระบบกลางสำหรับรับส่งไฟล์กับ Partner ผ่าน SFTP มีงานอัตโนมัติ การกำหนดสิทธิ์ การแปลงไฟล์ และ Log สำหรับตรวจสอบว่างานแต่ละรอบทำสำเร็จหรือไม่',
    sections: [
      ['Input', 'รับข้อมูลจาก Partner SFTP คำสั่งฐานข้อมูล และโฟลเดอร์ภายในระบบ'],
      ['Processing', 'Workflow ทดสอบการเชื่อมต่อ รับส่งไฟล์ แปลงข้อมูล และ Export จาก DB เป็น CSV'],
      ['Security', 'ใช้ SFTP, SSH Key, สิทธิ์ผู้ใช้งาน และ PGP เพื่อป้องกันข้อมูลระหว่างทาง'],
      ['Output', 'เก็บไฟล์ผลลัพธ์ สถานะงาน และ Job Log ไว้ตรวจสอบย้อนหลัง']
    ],
    flows: ['เชื่อมต่อ SFTP', 'รับส่งไฟล์เข้าและออก', 'ทำงานตาม Trigger', 'แปลง CSV/DB', 'จัดทำผล Audit']
  },
  {
    id: 'crm',
    title: 'CRM Lead / PEGA Blueprint',
    subtitle: 'ออกแบบขั้นตอนรับเรื่อง ตรวจสอบ อนุมัติ และส่งต่องานในรูปแบบ Case',
    file: '/crm-pega.html',
    image: '/assets/diagrams/crm-pega.png',
    stack: ['PEGA Blueprint', 'CRM', 'Approval', 'BPM'],
    overview:
      'แบบจำลองนี้ช่วยจัดระเบียบงาน CRM และการอนุมัติสินเชื่อ จากเดิมที่ทำงานแยกกัน ให้เห็นว่าแต่ละ Case ผ่านใครบ้าง ใช้ข้อมูลอะไร และจบงานอย่างไร',
    sections: [
      ['Input', 'เริ่มจากคำขอลูกค้า เอกสารสาขา และรายละเอียด Lead'],
      ['Workflow', 'แยกขั้นตอนอนุมัติเครดิต วิเคราะห์ข้อมูล และจัดทำสัญญา'],
      ['Data', 'เก็บข้อมูลลูกค้า คำขอสินเชื่อ สถานะ เอกสาร และข้อมูลสัญญา'],
      ['Output', 'ทีมธุรกิจและทีมพัฒนาใช้ภาพเดียวกันก่อนนำไปทำระบบจริง']
    ],
    flows: ['รับ Lead', 'สร้าง Case', 'ตรวจสอบการอนุมัติ', 'จัดทำสัญญา', 'ส่งกลับ Feedback']
  },
  {
    id: 'incidentweb',
    title: 'IncidentWeb',
    subtitle: 'รับแจ้งเหตุ ติดตามงาน มอบหมายทีม วิเคราะห์สาเหตุ และดูผลผ่าน Dashboard',
    file: '/incidentweb.html',
    image: '/assets/diagrams/incidentweb.png',
    stack: ['Next.js', 'Express API', 'PostgreSQL', 'JWT/RBAC', 'Report Export'],
    overview:
      'ระบบสำหรับรับแจ้งเหตุและติดตามปัญหา ตั้งแต่เปิดเรื่อง จัดลำดับความสำคัญ มอบหมายทีม ติดตาม SLA วิเคราะห์สาเหตุ ไปจนถึงออกรายงานและดูภาพรวมงาน',
    sections: [
      ['User', 'ผู้ใช้งานเปิด Incident ใส่รายละเอียดผลกระทบ ติดตามสถานะ และออกรายงาน'],
      ['Manager', 'ผู้จัดการดูงานของทีม จัดลำดับความสำคัญ มอบหมายงาน และติดตาม SLA'],
      ['Admin', 'ผู้ดูแลระบบจัดการผู้ใช้งาน บทบาท ทีม โปรเจกต์ Template และประวัติการ Import'],
      ['Runtime', 'หน้าเว็บเรียก API เพื่อบันทึกข้อมูลใน PostgreSQL และสร้างไฟล์รายงาน Excel, Word หรือ PDF']
    ],
    flows: ['สร้าง Incident', 'คัดกรองและมอบหมายงาน', 'วิเคราะห์ปัญหา', 'Export เอกสาร', 'ติดตามผลผ่าน Dashboard'],
    scenarios: [
      'Incident Production ที่กระทบผู้ใช้งาน',
      'ปัญหาเดิมเกิดซ้ำในโปรเจกต์เดียวกัน',
      'Export รายงานสำหรับผู้บริหาร',
      'ปัญหาจาก Template หรือการตรวจสอบไฟล์ Import',
      'ตรวจสอบภาระงานทีมและรายการเกินกำหนด'
    ]
  },
  {
    id: 'nt',
    title: 'NT Reconciliation / Payment Process',
    subtitle: 'ตรวจสอบรายการ Payment ตั้งแต่รับไฟล์เข้าระบบจนแสดงผลบนหน้าเว็บ',
    file: '/nt-reconciliation.html',
    image: '/assets/diagrams/nt-reconciliation.png',
    stack: ['File Ingestion', 'Payment Matching', 'Reconcile DB', 'Web Dashboard'],
    overview:
      'กระบวนการตรวจสอบยอด Payment ของแต่ละระบบ ตั้งแต่รับไฟล์ เก็บข้อมูลระหว่างทาง จัด Mapping ตรวจสอบและจับคู่รายการ จนแสดงผลให้ทีมงานตรวจสอบบนเว็บ',
    sections: [
      ['Source Systems', 'OM, NTPOS, Customer360, Web Self Care, BRM และ Billing Gateway ส่งข้อมูล Order, Billing และ Payment'],
      ['Processing', 'นำไฟล์เข้า Staging ปรับรูปแบบ ตรวจสอบ และจับคู่ด้วยเลขรายการ จำนวนเงิน วันที่ชำระ และ Billing Reference'],
      ['Result', 'เก็บสถานะจับคู่สำเร็จ จับคู่ไม่ได้ รอตรวจสอบ หรือยอดไม่ตรง พร้อมเหตุผล'],
      ['Web', 'Dashboard แสดงสถานะ Payment รายการผิดปกติ ตัวกรอง และรายละเอียดแต่ละรายการ']
    ],
    flows: ['รับไฟล์เข้า', 'จัดเก็บ Staging', 'จัด Mapping', 'ตรวจสอบ Payment', 'บันทึกผล Reconcile', 'แสดงผลบนเว็บ']
  },
  {
    id: 'petsinto',
    title: 'PetsInto Platform',
    subtitle: 'แพลตฟอร์มบริการสัตว์เลี้ยงที่เชื่อมต่อ Mobile App, Admin Web และระบบภายนอก',
    file: '/petsinto.html',
    image: '/assets/diagrams/petsinto.png',
    stack: ['Mobile App', 'Admin Web', 'Spring Boot API', 'PostgreSQL', 'Integration'],
    overview:
      'แพลตฟอร์มบริการสัตว์เลี้ยงที่รวมแอปของเจ้าของสัตว์ แอปของสัตวแพทย์ และหน้า Admin ไว้กับ Backend, ระบบชำระเงิน การแจ้งเตือน Video Session และ HIS',
    sections: [
      ['Clients', 'Owner และ Vet Mobile App ใช้งานประจำวัน ส่วน Admin Web ใช้จัดการงานหลังบ้าน'],
      ['Backend', 'Mobile API และ Admin API จัดการสิทธิ์ Business Module รายงาน และการเรียกใช้ระบบอื่น'],
      ['Data', 'PostgreSQL และ Liquibase ดูแลข้อมูลหลัก ข้อมูลธุรกรรม และข้อมูลสำหรับรายงาน'],
      ['Integration', 'เชื่อมต่อ Keycloak, LINE/Google, Firebase, SCB, Agora และ HIS ตามงานที่เกี่ยวข้อง']
    ],
    flows: ['เข้าใช้งาน Mobile/Admin', 'เรียก Backend API', 'ประมวลผล Business Module', 'จัดเก็บ PostgreSQL', 'เชื่อมต่อระบบภายนอก']
  }
];

const sectionLabels = {
  Input: 'ข้อมูลนำเข้า',
  Processing: 'การประมวลผล',
  Data: 'ชั้นข้อมูล',
  Output: 'ผลลัพธ์',
  Security: 'ความปลอดภัย',
  Workflow: 'กระบวนการทำงาน',
  Source: 'ระบบต้นทาง',
  Result: 'ผลลัพธ์การตรวจสอบ',
  Web: 'หน้าเว็บ',
  Clients: 'ผู้ใช้งานและแอปพลิเคชัน',
  Backend: 'ระบบ Backend',
  Integration: 'การเชื่อมต่อระบบ',
  User: 'ผู้ใช้งาน',
  Manager: 'ผู้จัดการ',
  Admin: 'ผู้ดูแลระบบ',
  Runtime: 'การทำงานของระบบ'
};

const sectionImportance = {
  Input: 'เป็นจุดเริ่มต้นของข้อมูล หากรับไฟล์หรือข้อมูลไม่ครบ ขั้นตอนถัดไปจะทำงานต่อไม่ได้',
  Processing: 'เป็นส่วนที่ควบคุมลำดับงานและกติกาการประมวลผล ทำให้แต่ละรอบทำงานตามขั้นตอนเดียวกัน',
  Data: 'เป็นแหล่งเก็บข้อมูลที่ใช้ตรวจสอบย้อนหลังและเป็นฐานให้ระบบอื่นนำไปใช้งานต่อ',
  Output: 'ทำให้ผู้ใช้งานเห็นผลลัพธ์ที่เข้าใจง่าย และนำข้อมูลไปใช้ตัดสินใจหรือทำงานต่อได้',
  Security: 'ช่วยควบคุมว่าใครเข้าถึงข้อมูลหรือสั่งงานส่วนใดได้บ้าง',
  Workflow: 'ช่วยให้ทุกฝ่ายเห็นขั้นตอนเดียวกัน ลดงานตกหล่นและติดตามสถานะได้',
  Source: 'ทำให้รู้ว่าข้อมูลมาจากระบบใดและใช้ตรวจสอบที่มาของรายการได้',
  Result: 'ช่วยแยกรายการปกติออกจากรายการที่ต้องตรวจสอบและแก้ไข',
  Web: 'เป็นจุดที่ผู้ใช้งานใช้ดูสถานะ ค้นหารายการ และติดตามผลการทำงาน',
  Clients: 'เป็นช่องทางที่ผู้ใช้งานใช้เริ่มต้นกระบวนการและรับผลลัพธ์จากระบบ',
  Backend: 'เป็นชั้นกลางที่รับคำสั่ง ประมวลผลกติกาธุรกิจ และเชื่อมต่อกับข้อมูล',
  Integration: 'ทำให้ระบบแลกเปลี่ยนข้อมูลกับบริการภายนอกได้ตามกระบวนการจริง',
  User: 'ช่วยให้ผู้ใช้งานเปิดเรื่องและติดตามงานได้ด้วยตัวเอง',
  Manager: 'ช่วยให้ผู้จัดการเห็นภาพรวมและตัดสินใจจัดลำดับงานได้เร็วขึ้น',
  Admin: 'ช่วยให้ผู้ดูแลควบคุมข้อมูลตั้งต้น สิทธิ์ และการตั้งค่าของระบบ',
  Runtime: 'เป็นโครงสร้างที่ทำให้หน้าเว็บ API และฐานข้อมูลทำงานร่วมกันได้อย่างต่อเนื่อง'
};

const blockDetails = {
  '39 Bank Source Groups': ['รวมแหล่งข้อมูล OBACIF, LIIMS, CBS_LN_PD, HR และ master data เพื่อส่งเข้ากระบวนการตรวจคุณภาพ', 'ทำให้ระบบรู้ว่าข้อมูลมาจากแหล่งใดและตรวจสอบย้อนหลังได้'],
  'FTP / SFTP Drop Zone': ['รับไฟล์ ตรวจชื่อและรูปแบบ เก็บไฟล์ต้นฉบับ และแยกไฟล์ที่พร้อมประมวลผลออกจากไฟล์ผิดเงื่อนไข', 'ป้องกันไฟล์สูญหายและรองรับการประมวลผลซ้ำ'],
  'Listener / Schedule': ['ตรวจ event หรือเวลาที่กำหนด แล้วเรียก batch รายวัน รายเดือน หรือรอบที่ผู้ดูแลสั่งเอง', 'ทำให้งานทำงานตามรอบโดยไม่ต้องเริ่มด้วยมือ'],
  'Ops User': ['ตรวจสถานะ ดู error และสั่ง rerun หรือแก้ไข batch ที่ไม่สำเร็จ', 'เป็นจุดควบคุมสำหรับกู้คืนงาน'],
  'CloverDX Jobflows': ['จัดลำดับ batch ตั้งแต่รับไฟล์ เรียก module ตรวจสอบ จนถึงโหลดผลลัพธ์', 'ควบคุม dependency และลำดับการทำงาน'],
  'Graphs / Subgraphs': ['แยกขั้นตอนอ่านข้อมูล แปลงค่า ตรวจ rule และเขียนผลเป็น graph ที่นำกลับมาใช้ซ้ำได้', 'ลด logic ซ้ำและแก้ไขเป็นส่วน ๆ ได้'],
  'Data Quality Rules': ['ตรวจ duplicate, completeness, format และ business rule พร้อมคำนวณ flag, KPI หรือ grade', 'เป็นด่านตัดสินว่าข้อมูลพร้อมใช้ต่อหรือไม่'],
  'PostgreSQL STG': ['เก็บข้อมูลดิบ ข้อมูลระหว่างทาง และรายการ reject หรือ error ของแต่ละรอบ', 'ใช้ตรวจหาสาเหตุและเทียบกับข้อมูลต้นฉบับ'],
  'PostgreSQL Central': ['เก็บข้อมูลที่ผ่าน validation รวม KPI และ grade เพื่อให้ระบบปลายทางใช้งาน', 'เป็นแหล่งข้อมูลกลางของผลตรวจคุณภาพ'],
  'Reports / Dashboard': ['สรุปผลตรวจ จำนวนรายการผิดเงื่อนไข และ KPI ให้ติดตามตามรอบงาน', 'ช่วยให้ทีมเห็นปัญหาก่อนกระทบงานธุรกิจ'],
  'Housekeeping': ['ทำ archive, backup, vacuum และ refresh materialized view ตามรอบ', 'ควบคุมพื้นที่และเตรียมฐานข้อมูลสำหรับรอบถัดไป'],
  'Partner SFTP': ['รับส่งไฟล์กับ partner ผ่าน inbox หรือ outbox โดยใช้ SSH key', 'แลกเปลี่ยนข้อมูลระหว่างองค์กรอย่างปลอดภัย'],
  'Web User': ['จัดการ virtual folder และเข้าถึงไฟล์ตาม permission ที่ได้รับ', 'จำกัดการเข้าถึงไฟล์ตามหน้าที่'],
  'Scheduler / Trigger': ['เริ่ม workflow จากเวลา schedule หรือ event เช่น มีไฟล์ใหม่เข้ามา', 'ทำให้การรับส่งไฟล์เป็นอัตโนมัติ'],
  'Admin': ['สร้างหรือแก้ workflow ทดสอบ connection ดูสถานะงาน และตรวจ audit log', 'รวมการควบคุมงานรับส่งไฟล์ไว้จุดเดียว'],
  'GoAnywhere Projects': ['เก็บ XML definition ของ workflow สำหรับรับส่งไฟล์ แปลงข้อมูล และจัดการผลลัพธ์', 'ทำให้ workflow deploy และแก้ไขเป็นชุดได้'],
  'Transfer Jobs': ['ทดสอบ connection แล้วทำ inbound หรือ outbound transfer ตามปลายทาง', 'ควบคุมการส่งไฟล์จริงและผลสำเร็จของงาน'],
  'ETL / Security Jobs': ['แปลง CSV เชื่อมฐานข้อมูล สร้างไฟล์ เข้ารหัส PGP และทำ housekeeping', 'ทำให้ข้อมูลพร้อมส่งต่อและยังอยู่ภายใต้ security policy'],
  'Database': ['อ่านข้อมูลต้นทางหรือ export ข้อมูลออกมาเป็นไฟล์ให้ workflow ประมวลผล', 'เป็นแหล่งข้อมูลธุรกิจของงานรับส่ง'],
  'CSV Files': ['รับ input ผ่าน transform และสร้าง output ตาม format ของปลายทาง', 'เป็นรูปแบบกลางระหว่างระบบต่างชนิด'],
  'PGP / SSH Keys': ['เข้ารหัสไฟล์และยืนยันตัวตนของปลายทางก่อนเชื่อมต่อ SFTP', 'ปกป้องข้อมูลและ endpoint ระหว่างรับส่ง'],
  'Audit / Report': ['เก็บ job status, execution log และผลลัพธ์ของแต่ละ workflow', 'ทำให้ตรวจสอบย้อนหลังได้'],
  'Lead / Customer': ['เริ่มคำขอสินเชื่อ ส่งข้อมูลลูกค้า และแนบเอกสารเข้าสู่กระบวนการ', 'เป็นเจ้าของข้อมูลตั้งต้นของคำขอ'],
  'Branch / Sales': ['สร้าง case รับเอกสาร ตรวจเบื้องต้น และส่งเรื่องเข้า workflow', 'ทำให้ข้อมูลจากสาขาพร้อมเข้าสู่การพิจารณา'],
  'Approver': ['ตรวจข้อมูลและเอกสาร แล้วอนุมัติหรือส่งกลับเพื่อแก้ไข', 'เป็นจุดตัดสินใจของคำขอ'],
  'Operations': ['ติดตามสถานะ ทำ feedback ประสานข้อตกลง และส่งต่องานหลังอนุมัติ', 'ทำให้เรื่องเดินต่อจนจบกระบวนการ'],
  'Module 1': ['จัดการ workflow อนุมัติสินเชื่อ ตั้งแต่รับคำขอ ตรวจเอกสาร ส่งอนุมัติ และเปลี่ยนสถานะ case', 'ควบคุมเส้นทางหลักของคำขอสินเชื่อ'],
  'Module 2': ['รวบรวมและวิเคราะห์ข้อมูลรายงานหรือหน่วยงาน แล้วส่งผลให้ผู้มีอำนาจอนุมัติ', 'ทำให้การอนุมัติอ้างอิงข้อมูลชุดเดียวกัน'],
  'Module 3': ['จัดทำและติดตามข้อตกลงสินเชื่อหลังผ่านการอนุมัติ', 'เชื่อมผลอนุมัติกับเอกสารและการปิดงาน'],
  'Data Objects': ['เก็บข้อมูล case, customer, loan และ document ที่ใช้ร่วมกันใน workflow', 'ทำให้ทุก module ใช้ข้อมูลกลางชุดเดียวกัน'],
  'Workflows': ['กำหนดเส้นทาง approval, analysis และ agreement รวมถึงเงื่อนไขส่งกลับ', 'ทำให้ขั้นตอนเป็นมาตรฐานและติดตามสถานะได้'],
  'Blueprint Docs': ['บันทึก process model และ field mapping ที่ใช้เป็นข้อตกลงในการออกแบบ', 'ทำให้ business กับทีมพัฒนาตีความตรงกัน'],
  'Feedback Loop': ['ส่งสถานะ คำขอแก้ไข และผลการดำเนินงานกลับให้ผู้เกี่ยวข้อง', 'ป้องกัน case ค้างเมื่อข้อมูลไม่ครบ'],
  'User Portal': ['แจ้ง incident แนบรายละเอียด ติดตามสถานะ และดูผลการแก้ไข', 'เป็นช่องทางหลักในการบันทึกและติดตามเหตุการณ์'],
  'Manager View': ['ดู workload ทีม สถานะ SLA และรายการที่รออนุมัติหรือมอบหมาย', 'ช่วยจัดลำดับงานและแก้คอขวด'],
  'Admin Console': ['จัดการ master data นำเข้าข้อมูล ตรวจ import log และติดตามระบบ', 'เป็นจุดควบคุมข้อมูลตั้งต้นและงานดูแลระบบ'],
  'Report Pages': ['สร้างรายงาน incident, problem และ project พร้อมตัวกรอง', 'ทำให้ทุกฝ่ายใช้ข้อมูลติดตามผลชุดเดียวกัน'],
  'Authentication': ['ตรวจตัวตนด้วย JWT และกำหนดสิทธิ์ตาม role ก่อนเรียกใช้งาน', 'ป้องกันข้อมูลและคำสั่งที่เกินสิทธิ์'],
  'Next.js Frontend': ['จัดการ routing, form, editor และ dashboard ที่ผู้ใช้เปิดเรื่องและติดตามผล', 'แปลงกระบวนการหลังบ้านให้ใช้งานผ่านเว็บ'],
  'Express API': ['รับ REST request ตรวจ input และส่งต่อ service layer', 'ควบคุมรูปแบบ request และ response ของระบบ'],
  'Incident Service': ['ทำ triage, assignment, status และควบคุม SLA ของ incident', 'ส่งงานให้ทีมที่เหมาะสมและติดตามเวลา'],
  'Problem Analysis': ['บันทึก root cause, impact และ corrective action ของปัญหา', 'ช่วยป้องกันปัญหาเดิมเกิดซ้ำ'],
  'Export Service': ['สร้าง Excel, Word หรือ PDF จากข้อมูลตาม template', 'ทำให้ผลลัพธ์พร้อมนำไปใช้งานต่อ'],
  'PostgreSQL': ['เก็บ incident, user, team และ project รวมถึงความสัมพันธ์ของข้อมูล', 'เป็นฐานข้อมูลหลักของธุรกรรมและสถานะงาน'],
  'Audit / Logs': ['เก็บประวัติ import การเปลี่ยนสถานะ และ action ของผู้ใช้', 'ตรวจสอบย้อนหลังได้ว่าใครทำอะไรเมื่อไร'],
  'Documents': ['เก็บหรือสร้าง incident report, problem report และไฟล์ export', 'ทำให้ผลการแก้ไขพร้อมอ้างอิง'],
  'Dashboards': ['สรุป SLA, workload, trend และ project summary ตามบทบาท', 'ช่วยตัดสินใจจากสถานะงานจริง'],
  'OM': ['ส่งไฟล์คำสั่งซื้อเข้ากระบวนการกระทบยอด', 'เป็นข้อมูลฝั่ง order ที่ใช้เทียบกับ payment'],
  'NTPOS': ['ส่งไฟล์รายการชำระเงินจากจุดขายเข้าสู่ระบบกลาง', 'เป็นหลักฐานยอดรับเงินจริง'],
  'Customer360': ['ส่งข้อมูลลูกค้าเพื่อใช้เป็น reference ในการตรวจรายการชำระเงิน', 'ช่วยลดการจับคู่ผิดคน'],
  'Web Self Care': ['ส่งข้อมูลการชำระเงินจากช่องทางออนไลน์เข้ากระบวนการกลาง', 'ทำให้ online payment ถูกตรวจร่วมกับช่องทางอื่น'],
  'BRM': ['ส่งข้อมูล billing สำหรับเทียบยอดและเลขอ้างอิง', 'ยืนยันความสัมพันธ์กับรอบ billing'],
  'Billing Gateway': ['ส่งสถานะการชำระเงินกลับเข้าสู่กระบวนการติดตามผล', 'ทำให้เห็นผลล่าสุดของรายการ'],
  'File Ingestion': ['รับไฟล์ ตรวจความครบถ้วน เก็บ archive และสร้างตัวควบคุมรอบ batch', 'ป้องกันไฟล์หาย ไฟล์ซ้ำ และผิดรอบ'],
  'Staging & Mapping': ['เก็บ snapshot ดิบและแปลง field หรือ reference key ของแต่ละ source เป็นรูปแบบกลาง', 'ทำให้หลาย source ใช้กฎจับคู่เดียวกัน'],
  'Validation': ['ตรวจ format, duplicate และ reference ที่หายก่อนเริ่มจับคู่', 'แยกข้อมูลผิดโครงสร้างออกตั้งแต่ต้นทาง'],
  'Payment Matching': ['จับคู่ด้วย amount, date, order, customer และ billing reference แล้วบันทึกผล', 'เป็น logic หลักที่ระบุว่าชำระเงินตรงกับธุรกรรมใด'],
  'Exception Rules': ['จัดกลุ่ม matched, unmatched, pending และ discrepancy พร้อม reason code', 'ช่วยให้ทีมโฟกัสรายการผิดปกติ'],
  'Staging Tables': ['เก็บ raw source snapshot ของไฟล์แต่ละรอบก่อน mapping และ validation', 'รองรับการเทียบต้นฉบับและ rerun'],
  'Reconcile DB': ['เก็บผล matching สถานะ reconcile และ reason code ของรายการผิดปกติ', 'เป็นฐานกลางของ API และรายงาน'],
  'Backend API': ['ให้บริการ query, filter และ summary จากผล reconcile แก่หน้าเว็บ', 'แยกการอ่านข้อมูลออกจาก UI'],
  'Web Dashboard': ['แสดงสถานะ payment, mismatch และรายละเอียดแบบ drill-down', 'ช่วยทีมตรวจรายการค้างจากหน้าจอเดียว'],
  'Owner Mobile App': ['ให้เจ้าของสัตว์เลี้ยงนัดหมาย ดูข้อมูล และใช้บริการผ่าน PetInto-App', 'เป็นช่องทางเริ่มรายการของลูกค้า'],
  'Vet Mobile App': ['ให้สัตวแพทย์ดูตารางงาน บันทึกการรักษา และทำงานผ่านแอป', 'ส่งข้อมูลจากผู้ให้บริการกลับระบบกลาง'],
  'Admin Web': ['ให้ผู้ดูแลจัดการข้อมูลและงานหลังบ้านผ่าน Next.js, Refine และ AntD', 'เป็นช่องทางควบคุมแพลตฟอร์ม'],
  'SSO Login': ['รับ login ผ่าน LINE หรือ Google และตรวจสิทธิ์ผ่าน Keycloak', 'รวม policy การยืนยันตัวตนของหลายบทบาท'],
  'Mobile / Customer API': ['ให้ API แก่ mobile app สำหรับลูกค้า การนัดหมาย และการทำรายการ', 'เป็น contract หลักระหว่างแอปกับข้อมูลธุรกิจ'],
  'Admin API Backend': ['ให้ API ฝั่งผู้ดูแลจัดการข้อมูล งานหลังบ้าน และการตั้งค่าด้วย Spring Boot / JHipster', 'แยก logic และสิทธิ์ของ admin ออกจากลูกค้า'],
  'Business Modules': ['รวม booking, POS, inventory, report และ dashboard ที่ทำงานต่อจาก API', 'เปลี่ยนข้อมูลกลางให้เป็นกระบวนการใช้งานจริง'],
  'Agora': ['สร้างและจัดการ video session สำหรับการสื่อสารระหว่างผู้ใช้กับผู้ให้บริการ', 'รองรับการสื่อสารแบบ real-time'],
  'SCB CX Toolkit': ['เชื่อมขั้นตอน payment หรือ batch กับบริการภายนอกตาม flow', 'ทำให้ระบบต่อกับบริการธุรกรรมภายนอกได้'],
  'into-his': ['รับส่งข้อมูลกับ HIS ผ่าน service ที่แยกออกจากระบบหลัก', 'ลดการผูกติดและควบคุมขอบเขต integration']
};

const makeBlocks = (rows) => rows.map(([label, x, y, w, h, section]) => {
  const [description, importance] = blockDetails[label] ?? [
    'แสดงขั้นตอนการทำงานของ ' + label + ' ตามเส้นทางข้อมูลในแผนภาพ',
    'เป็นจุดที่ส่งต่อข้อมูลหรือผลลัพธ์ไปยังขั้นตอนถัดไป'
  ];
  return { label, x, y, w, h, section, description, importance };
});

const blockCatalog = {
  dqm: makeBlocks([
    ['39 Bank Source Groups', 72, 68, 180, 96, 0], ['FTP / SFTP Drop Zone', 330, 68, 160, 96, 0], ['Listener / Schedule', 590, 68, 165, 96, 1], ['Ops User', 822, 68, 170, 96, 1],
    ['CloverDX Jobflows', 290, 210, 210, 98, 1], ['Graphs / Subgraphs', 574, 210, 220, 98, 1], ['Data Quality Rules', 430, 332, 220, 98, 1],
    ['PostgreSQL STG', 80, 520, 180, 96, 2], ['PostgreSQL Central', 338, 520, 190, 96, 2], ['Reports / Dashboard', 610, 520, 170, 96, 3], ['Housekeeping', 842, 520, 165, 96, 3]
  ]),
  goanywhere: makeBlocks([
    ['Partner SFTP', 82, 70, 170, 96, 0], ['Web User', 334, 70, 165, 96, 0], ['Scheduler / Trigger', 592, 70, 170, 96, 1], ['Admin', 834, 70, 155, 96, 1],
    ['GoAnywhere Projects', 278, 214, 210, 98, 1], ['Transfer Jobs', 590, 214, 210, 98, 1], ['ETL / Security Jobs', 430, 344, 220, 98, 1],
    ['Database', 82, 528, 170, 96, 2], ['CSV Files', 326, 528, 170, 96, 0], ['PGP / SSH Keys', 584, 528, 170, 96, 1], ['Audit / Report', 834, 528, 160, 96, 3]
  ]),
  crm: makeBlocks([
    ['Lead / Customer', 76, 72, 170, 96, 0], ['Branch / Sales', 330, 72, 170, 96, 0], ['Approver', 586, 72, 170, 96, 1], ['Operations', 834, 72, 160, 96, 3],
    ['Module 1', 242, 218, 210, 98, 1], ['Module 2', 594, 218, 210, 98, 1], ['Module 3', 414, 354, 240, 98, 1],
    ['Data Objects', 84, 532, 160, 96, 2], ['Workflows', 332, 532, 170, 96, 1], ['Blueprint Docs', 582, 532, 170, 96, 3], ['Feedback Loop', 834, 532, 160, 96, 3]
  ]),
  incidentweb: makeBlocks([
    ['User Portal', 66, 70, 154, 96, 0], ['Manager View', 246, 70, 162, 96, 1], ['Admin Console', 438, 70, 170, 96, 2], ['Report Pages', 640, 70, 170, 96, 3], ['Authentication', 836, 70, 160, 96, 1],
    ['Next.js Frontend', 176, 226, 176, 98, 3], ['Express API', 420, 226, 176, 98, 1], ['Incident Service', 668, 226, 176, 98, 1], ['Problem Analysis', 292, 366, 190, 98, 1], ['Export Service', 576, 366, 190, 98, 3],
    ['PostgreSQL', 72, 542, 174, 96, 2], ['Audit / Logs', 306, 542, 174, 96, 2], ['Documents', 548, 542, 174, 96, 3], ['Dashboards', 790, 542, 190, 96, 3]
  ]),
  nt: makeBlocks([
    ['OM', 66, 72, 130, 96, 0], ['NTPOS', 218, 72, 130, 96, 0], ['Customer360', 370, 72, 150, 96, 0], ['Web Self Care', 542, 72, 150, 96, 0], ['BRM', 714, 72, 130, 96, 0], ['Billing Gateway', 866, 72, 140, 96, 0],
    ['File Ingestion', 166, 216, 190, 98, 1], ['Staging & Mapping', 446, 216, 190, 98, 1], ['Validation', 720, 216, 190, 98, 1], ['Payment Matching', 306, 356, 210, 98, 1], ['Exception Rules', 596, 356, 210, 98, 1],
    ['Staging Tables', 86, 532, 170, 96, 2], ['Reconcile DB', 332, 532, 190, 96, 2], ['Backend API', 604, 532, 160, 96, 3], ['Web Dashboard', 842, 532, 170, 96, 3]
  ]),
  petsinto: makeBlocks([
    ['Owner Mobile App', 76, 72, 170, 96, 0], ['Vet Mobile App', 332, 72, 180, 96, 0], ['Admin Web', 596, 72, 190, 96, 0], ['SSO Login', 846, 72, 150, 96, 1],
    ['Mobile / Customer API', 304, 220, 220, 98, 1], ['Admin API Backend', 556, 220, 224, 98, 1], ['Business Modules', 430, 356, 224, 98, 1],
    ['PostgreSQL', 76, 536, 170, 96, 2], ['Agora', 316, 536, 160, 96, 3], ['SCB CX Toolkit', 548, 536, 170, 96, 3], ['into-his', 798, 536, 180, 96, 3]
  ])
};

const defaultHotspots = [
  { label: 'ระบบต้นทาง / ผู้ใช้งาน', section: 0, x: 44, y: 42, w: 220, h: 105 },
  { label: 'การควบคุมกระบวนการ', section: 1, x: 286, y: 190, w: 220, h: 110 },
  { label: 'การตรวจสอบ', section: 1, x: 570, y: 190, w: 220, h: 110 },
  { label: 'ฐานข้อมูลและผลลัพธ์', section: 2, x: 70, y: 500, w: 220, h: 110 },
  { label: 'รายงาน / หน้าจอใช้งาน', section: 3, x: 580, y: 500, w: 220, h: 110 }
];

function App() {
  const [activeId, setActiveId] = useState('dqm');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1.25);
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [showInteractionTip, setShowInteractionTip] = useState(true);
  const [blockTipPosition, setBlockTipPosition] = useState({ top: 120, left: 24 });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(() => new Set());
  const pinchRef = useRef({ distance: 0, zoom: 1.25 });
  const activeProject = useMemo(() => projects.find((project) => project.id === activeId) ?? projects[0], [activeId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsImageOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMobileMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMobileMenuOpen]);

  useEffect(() => {
    projects.forEach((project) => {
      const image = new Image();
      image.onload = () => {
        setLoadedImages((current) => {
          if (current.has(project.image)) return current;
          return new Set(current).add(project.image);
        });
      };
      image.src = project.image;
    });
  }, []);

  return (
    <div className={['app-shell', isCollapsed ? 'sidebar-collapsed' : '', isMobileMenuOpen ? 'mobile-menu-open' : ''].filter(Boolean).join(' ')}>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
        type="button"
        aria-label={isMobileMenuOpen ? 'ปิดเมนูโปรเจกต์' : 'เปิดเมนูโปรเจกต์'}
        aria-expanded={isMobileMenuOpen}
      >
        <span className={isMobileMenuOpen ? 'menu-glyph close' : 'menu-glyph'} aria-hidden="true" />
        <span>โปรเจกต์</span>
      </button>
      <button
        className="sidebar-scrim"
        onClick={() => setIsMobileMenuOpen(false)}
        type="button"
        aria-label="ปิดเมนูโปรเจกต์"
      />
      <aside className="sidebar" aria-label="เมนูโปรเจกต์">
        <div className="brand-block">
          <div className="brand-row">
            <span className="brand-mark" aria-hidden="true">AD</span>
            <div className="brand-copy">
              <span className="overline">เอกสารระบบ</span>
              <h1>ผลงานโปรเจกต์</h1>
            </div>
            <button
              className="collapse-toggle"
              onClick={() => setIsCollapsed((collapsed) => !collapsed)}
              type="button"
              aria-label={isCollapsed ? 'ขยายเมนูโปรเจกต์' : 'ย่อเมนูโปรเจกต์'}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
            >
              <span aria-hidden="true">{isCollapsed ? '>' : '<'}</span>
            </button>
          </div>
        </div>
        <nav className="project-nav">
          {projects.map((project) => (
            <button
              key={project.id}
              className={project.id === activeId ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                setActiveId(project.id);
                setIsMobileMenuOpen(false);
                setIsImageOpen(false);
                setIsImageLoading(false);
        setSelectedModule(0);
        setSelectedBlock(null);
        setIsBlockModalOpen(false);
              }}
              type="button"
              title={project.title}
            >
              <span className="nav-index" aria-hidden="true">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
              <span className="nav-copy">
                <strong>{project.title}</strong>
                <span>{project.stack.slice(0, 3).join(' / ')}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="doc-view">
        <header className="site-header">
          <a className="site-brand" href="/" aria-label="Siwakorn Portfolio หน้าหลัก">
            <span className="site-brand-mark">S</span>
            <span>
              <strong>Siwakorn Khumthong Portfolio</strong>
              <small>System Architecture &amp; Engineering</small>
            </span>
          </a>
          <span className="site-header-label">ผลงานด้านระบบและการพัฒนา</span>
        </header>
        <header className="doc-hero">
          <div>
              <span className="overline">เอกสารสถาปัตยกรรมระบบ</span>
            <h2>{activeProject.title}</h2>
            <p>{activeProject.subtitle}</p>
          </div>
          <a className="open-link" href={activeProject.file} target="_blank" rel="noreferrer">
            เปิดหน้ารายละเอียด
          </a>
        </header>

        <section className="stack-strip" aria-label="เทคโนโลยีที่ใช้">
          {activeProject.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </section>

        <section className="content-grid">
          <article className="summary-panel">
            <h3>ภาพรวมระบบ</h3>
            <p>{activeProject.overview}</p>
          </article>
          <article className="summary-panel">
            <h3>กระบวนการหลัก</h3>
            <div className="flow-chain">
              {activeProject.flows.map((flow) => (
                <span key={flow}>{flow}</span>
              ))}
            </div>
          </article>
        </section>

        <section className="diagram-card">
          <div className="section-head">
            <div>
              <h3>แผนภาพสถาปัตยกรรม</h3>
              <p>คลิกที่ภาพเพื่อเปิดมุมมองขนาดใหญ่ และใช้ปุ่มควบคุมเพื่อขยายหรือย่อภาพ</p>
            </div>
          </div>
          <div className="diagram-page-tip" role="status">
            <span className="diagram-interaction-icon" aria-hidden="true">✦</span>
            <span>เปิดภาพขนาดใหญ่ แล้วแตะหรือคลิกที่แต่ละ Block เพื่อดูหน้าที่และกระบวนการทำงาน</span>
          </div>
          <div className="diagram-preview">
            <button className="diagram-image-button" type="button" onClick={() => { setIsImageLoading(!loadedImages.has(activeProject.image)); setShowInteractionTip(true); setIsImageOpen(true); }} aria-label={`เปิดภาพแผนภาพ ${activeProject.title}`}>
              <img src={activeProject.image} alt={`แผนภาพสถาปัตยกรรม ${activeProject.title}`} loading="eager" decoding="async" />
            </button>
            <span>เปิดภาพขนาดใหญ่</span>
          </div>
        </section>

        {isBlockModalOpen && selectedBlock ? (
          <section className="block-tip" role="dialog" aria-modal="false" aria-labelledby="block-modal-title" style={{ top: blockTipPosition.top, left: blockTipPosition.left }}>
              <div className="block-modal-topline">
                <span>คำอธิบาย Block</span>
                <button type="button" onClick={() => setIsBlockModalOpen(false)} aria-label="ปิดรายละเอียด Block" title="ปิด">ปิด</button>
              </div>
              <h3 id="block-modal-title">{selectedBlock.label}</h3>
              <p className="block-tip-description">{selectedBlock.description}</p>
              <div className="block-tip-importance">
                <strong>ความสำคัญ</strong>
                <p>{selectedBlock.importance}</p>
              </div>
          </section>
        ) : null}

        {isImageOpen ? (
          <div className="lightbox" role="dialog" aria-modal="true" aria-label={`ภาพแผนภาพ ${activeProject.title}`} onClick={() => setIsImageOpen(false)}>
            <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
              <div className="lightbox-header">
                <strong>{activeProject.title}</strong>
                <div className="lightbox-tools">
                  <button type="button" onClick={() => setImageZoom((zoom) => Math.max(0.6, zoom - 0.2))} aria-label="ย่อภาพ" title="ย่อภาพ">-</button>
                  <span aria-live="polite">{Math.round(imageZoom * 100)}%</span>
                  <button type="button" onClick={() => setImageZoom((zoom) => Math.min(3, zoom + 0.2))} aria-label="ขยายภาพ" title="ขยายภาพ">+</button>
                  <button type="button" onClick={() => setImageZoom(1.25)} aria-label="คืนค่าขนาดภาพ" title="คืนค่าขนาดภาพ">รีเซ็ต</button>
                  <button className="lightbox-close" type="button" onClick={() => setIsImageOpen(false)} aria-label="ปิดภาพขนาดใหญ่" title="ปิด">ปิด</button>
                </div>
              </div>
              <div
                className="lightbox-viewport"
                onTouchStart={(event) => {
                  if (event.touches.length === 2) {
                    const dx = event.touches[0].clientX - event.touches[1].clientX;
                    const dy = event.touches[0].clientY - event.touches[1].clientY;
                    pinchRef.current = { distance: Math.hypot(dx, dy), zoom: imageZoom };
                  }
                }}
                onTouchMove={(event) => {
                  if (event.touches.length === 2 && pinchRef.current.distance) {
                    event.preventDefault();
                    const dx = event.touches[0].clientX - event.touches[1].clientX;
                    const dy = event.touches[0].clientY - event.touches[1].clientY;
                    const distance = Math.hypot(dx, dy);
                    setImageZoom(Math.max(0.6, Math.min(3, pinchRef.current.zoom * (distance / pinchRef.current.distance))));
                  }
                }}
                onTouchEnd={() => { pinchRef.current.distance = 0; }}
              >
                {showInteractionTip ? (
                  <div className="diagram-interaction-tip" role="status">
                    <span className="diagram-interaction-icon" aria-hidden="true">✦</span>
                    <span>แตะหรือคลิกที่แต่ละ Block เพื่อดูกระบวนการทำงาน</span>
                    <button type="button" onClick={() => setShowInteractionTip(false)} aria-label="ปิดคำแนะนำ">ปิด</button>
                  </div>
                ) : null}
                <div className="lightbox-image-wrap" style={{ width: `${imageZoom * 100}%`, minWidth: `${imageZoom * 720}px` }}>
                  <img
                    src={activeProject.image}
                    alt={`แผนภาพสถาปัตยกรรม ${activeProject.title} ขนาดใหญ่`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                  <div className="image-hotspots" aria-label="เลือก Block จากภาพ">
                    {(blockCatalog[activeProject.id] ?? []).map((block) => (
                      <button
                        className={selectedBlock?.label === block.label ? 'image-hotspot selected' : 'image-hotspot'}
                        type="button"
                        key={block.label}
                        style={{ left: `${(16 + block.x) / 11.2}%`, top: `${(16 + block.y) / 7.2}%`, width: `${block.w / 11.2}%`, height: `${block.h / 7.2}%`, '--touch-delay': `${(blockCatalog[activeProject.id].indexOf(block) % 5) * 0.32}s` }}
                        aria-label={`ดูรายละเอียด ${block.label}`}
                        onClick={(clickEvent) => {
                          const target = clickEvent.currentTarget.getBoundingClientRect();
                          const section = Math.min(block.section, activeProject.sections.length - 1);
                          setSelectedModule(section);
                          setSelectedBlock(block);
                          setIsBlockModalOpen(true);
                          setShowInteractionTip(false);
                          setBlockTipPosition({ top: Math.max(16, Math.min(window.innerHeight - 260, target.top)), left: Math.max(16, Math.min(window.innerWidth - 346, target.right + 12)) });
                        }}
                      />
                    ))}
                  </div>
                  {isImageLoading ? <div className="image-loading" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true" />กำลังโหลดภาพ...</div> : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <section className="module-section">
          <div className="module-section-head">
            <div>
              <h3>องค์ประกอบหลักในแผนภาพ</h3>
              <p>เลือก Block เพื่อดูหน้าที่และบทบาทของส่วนประกอบนั้นในระบบ</p>
            </div>
          </div>
          <div className="detail-grid">
          {activeProject.sections.map(([title, detail], index) => (
            <button className={selectedModule === index ? 'detail-card active' : 'detail-card'} type="button" key={title} onClick={() => setSelectedModule(index)}>
              <small>Block {String(index + 1).padStart(2, '0')}</small>
              <span>{sectionLabels[title] ?? title}</span>
              <p>{detail}</p>
            </button>
          ))}
          </div>
        </section>

        <section className="module-detail" aria-live="polite">
          <span>รายละเอียดโมดูล</span>
          <h3>{sectionLabels[activeProject.sections[selectedModule][0]] ?? activeProject.sections[selectedModule][0]}</h3>
          <p>{activeProject.sections[selectedModule][1]}</p>
        </section>

        {activeProject.scenarios ? (
          <section className="scenario-panel">
            <h3>ตัวอย่างเหตุการณ์การใช้งานจริง</h3>
            <div className="scenario-list">
              {activeProject.scenarios.map((scenario, index) => (
                <div key={scenario}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{scenario}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
