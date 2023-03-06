import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from 'openai';
import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';
import 'moment/locale/fr.js';
import cron from 'node-cron'

moment.locale('fr');
const port=process.env.PORT;
// Utilisation de Moment
const today = moment().locale('fr').format('LL');
dotenv.config();


const certificats = [
  {
      "Nombre de jours avant expiration": 10,
      "Nom du certificat": "echanges.ccifinance.fr",
      "Date d'expiration du certificat": "2023-03-17"
  },
  {
      "Nombre de jours avant expiration": 19,
      "Nom du certificat": "ADFS Encryption - Sts.lixir.fr",
      "Date d'expiration du certificat": "2023-03-26"
  },
  {
      "Nombre de jours avant expiration": 19,
      "Nom du certificat": "ADFS Signing - Sts.lixir.fr",
      "Date d'expiration du certificat": "2023-03-26"
  },
  {
      "Nombre de jours avant expiration": 19,
      "Nom du certificat": "CHAABI Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2023-03-26"
  },
  {
      "Nombre de jours avant expiration": 19,
      "Nom du certificat": "FRANCE BREVETS Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2023-03-26"
  },
  {
      "Nombre de jours avant expiration": 19,
      "Nom du certificat": "SIMT Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2023-03-26"
  },
  {
      "Nombre de jours avant expiration": 20,
      "Nom du certificat": "NEOCLES Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2023-03-27"
  },
  {
      "Nombre de jours avant expiration": 28,
      "Nom du certificat": "sts.lixir.fr",
      "Date d'expiration du certificat": "2023-04-04"
  },
  {
      "Nombre de jours avant expiration": 28,
      "Nom du certificat": "*.uvet.fr",
      "Date d'expiration du certificat": "2023-04-04"
  },
  {
      "Nombre de jours avant expiration": 31,
      "Nom du certificat": "mail-aub-1.neocles.fr",
      "Date d'expiration du certificat": "2023-04-07"
  },
  {
      "Nombre de jours avant expiration": 31,
      "Nom du certificat": "tms.ccifinance.fr",
      "Date d'expiration du certificat": "2023-04-07"
  },
  {
      "Nombre de jours avant expiration": 35,
      "Nom du certificat": "VS-SQLHAM100.VIASANTE.CLOUD",
      "Date d'expiration du certificat": "2023-04-11"
  },
  {
      "Nombre de jours avant expiration": 37,
      "Nom du certificat": "VIA SANTE Exchange Delegation Federation",
      "Date d'expiration du certificat": "2023-04-13"
  },
  {
      "Nombre de jours avant expiration": 42,
      "Nom du certificat": "FRANCE BREVETS Microsoft Exchange",
      "Date d'expiration du certificat": "2023-04-18"
  },
  {
      "Nombre de jours avant expiration": 53,
      "Nom du certificat": "mail.procie.com",
      "Date d'expiration du certificat": "2023-04-29"
  },
  {
      "Nombre de jours avant expiration": 54,
      "Nom du certificat": "mail-ruei-1.neocles.fr",
      "Date d'expiration du certificat": "2023-04-30"
  },
  {
      "Nombre de jours avant expiration": 54,
      "Nom du certificat": "*.neocles.com",
      "Date d'expiration du certificat": "2023-04-30"
  },
  {
      "Nombre de jours avant expiration": 54,
      "Nom du certificat": "GIMC ENVOLUDIA Citrix - *.neocles.com",
      "Date d'expiration du certificat": "2023-04-30"
  },
  {
      "Nombre de jours avant expiration": 54,
      "Nom du certificat": "CCI FINANCE Citrix - *.neocles.com",
      "Date d'expiration du certificat": "2023-04-30"
  },
  {
      "Nombre de jours avant expiration": 66,
      "Nom du certificat": "SAFT *.alcad.com",
      "Date d'expiration du certificat": "2023-05-12"
  },
  {
      "Nombre de jours avant expiration": 73,
      "Nom du certificat": "webmail.viasante.cloud-INT",
      "Date d'expiration du certificat": "2023-05-19"
  },
  {
      "Nombre de jours avant expiration": 76,
      "Nom du certificat": "*.infra.lucas.fr",
      "Date d'expiration du certificat": "2023-05-22"
  },
  {
      "Nombre de jours avant expiration": 89,
      "Nom du certificat": "CFR Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2023-06-04"
  },
  {
      "Nombre de jours avant expiration": 91,
      "Nom du certificat": "webmail.adapei65.fr",
      "Date d'expiration du certificat": "2023-06-06"
  },
  {
      "Nombre de jours avant expiration": 92,
      "Nom du certificat": "Citrix - storefront.regis-location.int",
      "Date d'expiration du certificat": "2023-06-07"
  },
  {
      "Nombre de jours avant expiration": 102,
      "Nom du certificat": "Citrix - *.eri.local",
      "Date d'expiration du certificat": "2023-06-17"
  },
  {
      "Nombre de jours avant expiration": 106,
      "Nom du certificat": "Citrix - storefront.lixir.entreprise.dom",
      "Date d'expiration du certificat": "2023-06-21"
  },
  {
      "Nombre de jours avant expiration": 106,
      "Nom du certificat": "WGSLIC02.lixir.entreprise.dom",
      "Date d'expiration du certificat": "2023-06-21"
  },
  {
      "Nombre de jours avant expiration": 109,
      "Nom du certificat": "nefvvc002.osm01.neofed.local",
      "Date d'expiration du certificat": "2023-06-24"
  },
  {
      "Nombre de jours avant expiration": 117,
      "Nom du certificat": "webmail.viasante.fr",
      "Date d'expiration du certificat": "2023-07-02"
  },
  {
      "Nombre de jours avant expiration": 117,
      "Nom du certificat": "*.acpei.pro",
      "Date d'expiration du certificat": "2023-07-02"
  },
  {
      "Nombre de jours avant expiration": 125,
      "Nom du certificat": "next.envoludia.org",
      "Date d'expiration du certificat": "2023-07-10"
  },
  {
      "Nombre de jours avant expiration": 131,
      "Nom du certificat": "NEO Citrix - Test - STF PKI",
      "Date d'expiration du certificat": "2023-07-16"
  },
  {
      "Nombre de jours avant expiration": 134,
      "Nom du certificat": "email.banquechaabi.fr-INT",
      "Date d'expiration du certificat": "2023-07-19"
  },
  {
      "Nombre de jours avant expiration": 134,
      "Nom du certificat": "NEOFED protection-kp",
      "Date d'expiration du certificat": "2023-07-19"
  },
  {
      "Nombre de jours avant expiration": 138,
      "Nom du certificat": "Citrix - storefront.adapei65.local",
      "Date d'expiration du certificat": "2023-07-23"
  },
  {
      "Nombre de jours avant expiration": 143,
      "Nom du certificat": "*.videlio.com",
      "Date d'expiration du certificat": "2023-07-28"
  },
  {
      "Nombre de jours avant expiration": 144,
      "Nom du certificat": "bmcdiscovery.neofed.local",
      "Date d'expiration du certificat": "2023-07-29"
  },
  {
      "Nombre de jours avant expiration": 148,
      "Nom du certificat": "mail.sagess.fr-INT",
      "Date d'expiration du certificat": "2023-08-02"
  },
  {
      "Nombre de jours avant expiration": 153,
      "Nom du certificat": "*.sagess.fr",
      "Date d'expiration du certificat": "2023-08-07"
  },
  {
      "Nombre de jours avant expiration": 153,
      "Nom du certificat": "Citrix - *.sagess.fr",
      "Date d'expiration du certificat": "2023-08-07"
  },
  {
      "Nombre de jours avant expiration": 155,
      "Nom du certificat": "mail.bredinprat.com-INT",
      "Date d'expiration du certificat": "2023-08-09"
  },
  {
      "Nombre de jours avant expiration": 155,
      "Nom du certificat": "nefrub001.neofed.local",
      "Date d'expiration du certificat": "2023-08-09"
  },
  {
      "Nombre de jours avant expiration": 159,
      "Nom du certificat": "*.simt.fr",
      "Date d'expiration du certificat": "2023-08-13"
  },
  {
      "Nombre de jours avant expiration": 169,
      "Nom du certificat": "webmail.adapei65.fr-INT",
      "Date d'expiration du certificat": "2023-08-23"
  },
  {
      "Nombre de jours avant expiration": 176,
      "Nom du certificat": "*.buyin.pro",
      "Date d'expiration du certificat": "2023-08-30"
  },
  {
      "Nombre de jours avant expiration": 185,
      "Nom du certificat": "*.eri.fr",
      "Date d'expiration du certificat": "2023-09-08"
  },
  {
      "Nombre de jours avant expiration": 186,
      "Nom du certificat": "Citrix citrix.neocorp.intranet.fr",
      "Date d'expiration du certificat": "2023-09-09"
  },
  {
      "Nombre de jours avant expiration": 187,
      "Nom du certificat": "*.uniprotect.fr",
      "Date d'expiration du certificat": "2023-09-10"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "simsky001.simt.corp",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "mail.simt.fr-INT",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "mail.ad.int-INT",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "Citrix - workspace.corp.simt.fr",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "CFR DC1-PX-HTTP",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "CFR DC2-PX-HTTP",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "Citrix - storectx.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "ad-CFRADC003-CA",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "CFR Multiple renouvellement de certificats",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "Citrix - director.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "smtp1-esa-in.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "smtp2-esa-in.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "CFRADC001.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 203,
      "Nom du certificat": "CFRADC002.ad.int",
      "Date d'expiration du certificat": "2023-09-26"
  },
  {
      "Nombre de jours avant expiration": 205,
      "Nom du certificat": "mail.stimtechnibat.fr",
      "Date d'expiration du certificat": "2023-09-28"
  },
  {
      "Nombre de jours avant expiration": 206,
      "Nom du certificat": "vpn.bredinprat.com",
      "Date d'expiration du certificat": "2023-09-29"
  },
  {
      "Nombre de jours avant expiration": 211,
      "Nom du certificat": "FRANCE BREVETS webmail.francebrevets.com",
      "Date d'expiration du certificat": "2023-10-04"
  },
  {
      "Nombre de jours avant expiration": 211,
      "Nom du certificat": "NEO Citrix - Test - store 1909",
      "Date d'expiration du certificat": "2023-10-04"
  },
  {
      "Nombre de jours avant expiration": 212,
      "Nom du certificat": "nefvvc005.neofed.local",
      "Date d'expiration du certificat": "2023-10-05"
  },
  {
      "Nombre de jours avant expiration": 214,
      "Nom du certificat": "nefvvc006.osm02.neofed.local",
      "Date d'expiration du certificat": "2023-10-07"
  },
  {
      "Nombre de jours avant expiration": 214,
      "Nom du certificat": "nefvvc007.osm03.neofed.local",
      "Date d'expiration du certificat": "2023-10-07"
  },
  {
      "Nombre de jours avant expiration": 218,
      "Nom du certificat": "RDS - rds.videlio.local",
      "Date d'expiration du certificat": "2023-10-11"
  },
  {
      "Nombre de jours avant expiration": 220,
      "Nom du certificat": "Citrix - partcitrix.viasante.net",
      "Date d'expiration du certificat": "2023-10-13"
  },
  {
      "Nombre de jours avant expiration": 221,
      "Nom du certificat": "RDS - *.videlio.local",
      "Date d'expiration du certificat": "2023-10-14"
  },
  {
      "Nombre de jours avant expiration": 223,
      "Nom du certificat": "mail.sd-ingenierie.fr",
      "Date d'expiration du certificat": "2023-10-16"
  },
  {
      "Nombre de jours avant expiration": 224,
      "Nom du certificat": "bureau.silabel.fr",
      "Date d'expiration du certificat": "2023-10-17"
  },
  {
      "Nombre de jours avant expiration": 228,
      "Nom du certificat": "mail.capeb-vendee.fr",
      "Date d'expiration du certificat": "2023-10-21"
  },
  {
      "Nombre de jours avant expiration": 228,
      "Nom du certificat": "mail.eviafoods.com",
      "Date d'expiration du certificat": "2023-10-21"
  },
  {
      "Nombre de jours avant expiration": 228,
      "Nom du certificat": "mail.fondinvest.com",
      "Date d'expiration du certificat": "2023-10-21"
  },
  {
      "Nombre de jours avant expiration": 232,
      "Nom du certificat": "email.banquechaabi.fr",
      "Date d'expiration du certificat": "2023-10-25"
  },
  {
      "Nombre de jours avant expiration": 241,
      "Nom du certificat": "mail.uniprotect.fr",
      "Date d'expiration du certificat": "2023-11-03"
  },
  {
      "Nombre de jours avant expiration": 246,
      "Nom du certificat": "SAGESS AzureRunAsCertificate",
      "Date d'expiration du certificat": "2023-11-08"
  },
  {
      "Nombre de jours avant expiration": 266,
      "Nom du certificat": "webmail.bredinprat.com",
      "Date d'expiration du certificat": "2023-11-28"
  },
  {
      "Nombre de jours avant expiration": 268,
      "Nom du certificat": "ged.resah.fr",
      "Date d'expiration du certificat": "2023-11-30"
  },
  {
      "Nombre de jours avant expiration": 269,
      "Nom du certificat": "*.adapei65.fr",
      "Date d'expiration du certificat": "2023-12-01"
  },
  {
      "Nombre de jours avant expiration": 277,
      "Nom du certificat": "Citrix - *.gfm-mut.com",
      "Date d'expiration du certificat": "2023-12-09"
  },
  {
      "Nombre de jours avant expiration": 285,
      "Nom du certificat": "VIS Citrix - app-citrix.viasante.cloud",
      "Date d'expiration du certificat": "2023-12-17"
  },
  {
      "Nombre de jours avant expiration": 285,
      "Nom du certificat": "mail.bredinprat.com",
      "Date d'expiration du certificat": "2023-12-17"
  },
  {
      "Nombre de jours avant expiration": 285,
      "Nom du certificat": "VIS Citrix Director - app-citrixdirector",
      "Date d'expiration du certificat": "2023-12-17"
  },
  {
      "Nombre de jours avant expiration": 285,
      "Nom du certificat": "vs-lic001.viasante.cloud",
      "Date d'expiration du certificat": "2023-12-17"
  },
  {
      "Nombre de jours avant expiration": 292,
      "Nom du certificat": "*.banquerichelieu.com",
      "Date d'expiration du certificat": "2023-12-24"
  },
  {
      "Nombre de jours avant expiration": 298,
      "Nom du certificat": "francemutuelle.fr",
      "Date d'expiration du certificat": "2023-12-30"
  },
  {
      "Nombre de jours avant expiration": 307,
      "Nom du certificat": "*.proudreed.com",
      "Date d'expiration du certificat": "2024-01-08"
  },
  {
      "Nombre de jours avant expiration": 310,
      "Nom du certificat": "cashpooler.ccifinance.fr",
      "Date d'expiration du certificat": "2024-01-11"
  },
  {
      "Nombre de jours avant expiration": 329,
      "Nom du certificat": "rec-cashpooler.ccifinance.fr",
      "Date d'expiration du certificat": "2024-01-30"
  },
  {
      "Nombre de jours avant expiration": 331,
      "Nom du certificat": "cloud-tms.valeo.com",
      "Date d'expiration du certificat": "2024-02-01"
  },
  {
      "Nombre de jours avant expiration": 331,
      "Nom du certificat": "mail.procie.com-INT",
      "Date d'expiration du certificat": "2024-02-01"
  },
  {
      "Nombre de jours avant expiration": 331,
      "Nom du certificat": "cloud-tms-ext.valeo.com",
      "Date d'expiration du certificat": "2024-02-01"
  },
  {
      "Nombre de jours avant expiration": 332,
      "Nom du certificat": "*.sleever.com",
      "Date d'expiration du certificat": "2024-02-02"
  },
  {
      "Nombre de jours avant expiration": 332,
      "Nom du certificat": "Citrix - *.sleever.com",
      "Date d'expiration du certificat": "2024-02-02"
  },
  {
      "Nombre de jours avant expiration": 332,
      "Nom du certificat": "RDS - syrbrk001.bureautique.intra",
      "Date d'expiration du certificat": "2024-02-02"
  },
  {
      "Nombre de jours avant expiration": 337,
      "Nom du certificat": "AD10-SLEEVER.sleever.local",
      "Date d'expiration du certificat": "2024-02-07"
  },
  {
      "Nombre de jours avant expiration": 341,
      "Nom du certificat": "*.cpssp.fr",
      "Date d'expiration du certificat": "2024-02-11"
  },
  {
      "Nombre de jours avant expiration": 345,
      "Nom du certificat": "mail.neocles.fr-INT",
      "Date d'expiration du certificat": "2024-02-15"
  },
  {
      "Nombre de jours avant expiration": 345,
      "Nom du certificat": "neosky002.neocorp.intranet.fr",
      "Date d'expiration du certificat": "2024-02-15"
  },
  {
      "Nombre de jours avant expiration": 345,
      "Nom du certificat": "neowac001.neocorp.intranet.fr",
      "Date d'expiration du certificat": "2024-02-15"
  },
  {
      "Nombre de jours avant expiration": 346,
      "Nom du certificat": "RDS - *.carced.local",
      "Date d'expiration du certificat": "2024-02-16"
  },
  {
      "Nombre de jours avant expiration": 348,
      "Nom du certificat": "*.metaldeploye.com",
      "Date d'expiration du certificat": "2024-02-18"
  },
  {
      "Nombre de jours avant expiration": 351,
      "Nom du certificat": "*.adgessa.fr",
      "Date d'expiration du certificat": "2024-02-21"
  },
  {
      "Nombre de jours avant expiration": 353,
      "Nom du certificat": "GFMMES004.gfm-mut.com",
      "Date d'expiration du certificat": "2024-02-23"
  },
  {
      "Nombre de jours avant expiration": 354,
      "Nom du certificat": "a65oct001",
      "Date d'expiration du certificat": "2024-02-24"
  },
  {
      "Nombre de jours avant expiration": 360,
      "Nom du certificat": "BIGARD webmail.bigard.fr",
      "Date d'expiration du certificat": "2024-03-01"
  },
  {
      "Nombre de jours avant expiration": 361,
      "Nom du certificat": "mail.nidek.fr-INT",
      "Date d'expiration du certificat": "2024-03-02"
  },
  {
      "Nombre de jours avant expiration": 364,
      "Nom du certificat": "mail.nidek.fr",
      "Date d'expiration du certificat": "2024-03-05"
  },
  {
      "Nombre de jours avant expiration": 367,
      "Nom du certificat": "mail.francemutuelle.fr-INT",
      "Date d'expiration du certificat": "2024-03-08"
  },
  {
      "Nombre de jours avant expiration": 374,
      "Nom du certificat": "citrix.bredinprat.com",
      "Date d'expiration du certificat": "2024-03-15"
  },
  {
      "Nombre de jours avant expiration": 409,
      "Nom du certificat": "Citrix - storefront.stim.local",
      "Date d'expiration du certificat": "2024-04-19"
  },
  {
      "Nombre de jours avant expiration": 487,
      "Nom du certificat": "mail.stimtechnibat.fr-INT",
      "Date d'expiration du certificat": "2024-07-06"
  },
  {
      "Nombre de jours avant expiration": 512,
      "Nom du certificat": "CAPEB Citrix - storefront",
      "Date d'expiration du certificat": "2024-07-31"
  },
  {
      "Nombre de jours avant expiration": 516,
      "Nom du certificat": "Citrix - storefront.ocspecial.local",
      "Date d'expiration du certificat": "2024-08-04"
  },
  {
      "Nombre de jours avant expiration": 536,
      "Nom du certificat": "mail.sd-ingenierie.fr-INT",
      "Date d'expiration du certificat": "2024-08-24"
  },
  {
      "Nombre de jours avant expiration": 537,
      "Nom du certificat": "mail.uniprotect.fr-INT",
      "Date d'expiration du certificat": "2024-08-25"
  },
  {
      "Nombre de jours avant expiration": 538,
      "Nom du certificat": "nefnoc002.neofed.local",
      "Date d'expiration du certificat": "2024-08-26"
  },
  {
      "Nombre de jours avant expiration": 541,
      "Nom du certificat": "UNIPROTECT Citrix - storefront",
      "Date d'expiration du certificat": "2024-08-29"
  },
  {
      "Nombre de jours avant expiration": 541,
      "Nom du certificat": "INTERCARGO Citrix - Storefront",
      "Date d'expiration du certificat": "2024-08-29"
  },
  {
      "Nombre de jours avant expiration": 547,
      "Nom du certificat": "mail.eviafoods.com-INT",
      "Date d'expiration du certificat": "2024-09-04"
  },
  {
      "Nombre de jours avant expiration": 550,
      "Nom du certificat": "mail.capeb-vendee.fr-INT",
      "Date d'expiration du certificat": "2024-09-07"
  },
  {
      "Nombre de jours avant expiration": 550,
      "Nom du certificat": "mail.fondinvest.com-INT",
      "Date d'expiration du certificat": "2024-09-07"
  },
  {
      "Nombre de jours avant expiration": 561,
      "Nom du certificat": "TECHNIC DSG Citrix - storefront",
      "Date d'expiration du certificat": "2024-09-18"
  },
  {
      "Nombre de jours avant expiration": 562,
      "Nom du certificat": "*.neofed.local",
      "Date d'expiration du certificat": "2024-09-19"
  },
  {
      "Nombre de jours avant expiration": 563,
      "Nom du certificat": "FONDINVEST Citrix - storefront",
      "Date d'expiration du certificat": "2024-09-20"
  },
  {
      "Nombre de jours avant expiration": 569,
      "Nom du certificat": "SD INGENIERIE Citrix - storefront.",
      "Date d'expiration du certificat": "2024-09-26"
  },
  {
      "Nombre de jours avant expiration": 576,
      "Nom du certificat": "CFR Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2024-10-03"
  },
  {
      "Nombre de jours avant expiration": 582,
      "Nom du certificat": "GESTIPRO Citrix - Storefront",
      "Date d'expiration du certificat": "2024-10-09"
  },
  {
      "Nombre de jours avant expiration": 582,
      "Nom du certificat": "EVIA FOODS Citrix - storefront",
      "Date d'expiration du certificat": "2024-10-09"
  },
  {
      "Nombre de jours avant expiration": 591,
      "Nom du certificat": "Citrix storefront.neocorp.intranet.fr",
      "Date d'expiration du certificat": "2024-10-18"
  },
  {
      "Nombre de jours avant expiration": 596,
      "Nom du certificat": "Citrix - ddslogistics-DDSADC01-CA",
      "Date d'expiration du certificat": "2024-10-23"
  },
  {
      "Nombre de jours avant expiration": 603,
      "Nom du certificat": "CFRMES002",
      "Date d'expiration du certificat": "2024-10-30"
  },
  {
      "Nombre de jours avant expiration": 604,
      "Nom du certificat": "Citrix - storefront.proudreed.local",
      "Date d'expiration du certificat": "2024-10-31"
  },
  {
      "Nombre de jours avant expiration": 618,
      "Nom du certificat": "mail.eri.fr-INT",
      "Date d'expiration du certificat": "2024-11-14"
  },
  {
      "Nombre de jours avant expiration": 629,
      "Nom du certificat": "CFRPKI001-CA",
      "Date d'expiration du certificat": "2024-11-25"
  },
  {
      "Nombre de jours avant expiration": 641,
      "Nom du certificat": "CFRMES001",
      "Date d'expiration du certificat": "2024-12-07"
  },
  {
      "Nombre de jours avant expiration": 669,
      "Nom du certificat": "IZARET Citrix - workspace",
      "Date d'expiration du certificat": "2025-01-04"
  },
  {
      "Nombre de jours avant expiration": 680,
      "Nom du certificat": "slemes001.sleever.local",
      "Date d'expiration du certificat": "2025-01-15"
  },
  {
      "Nombre de jours avant expiration": 681,
      "Nom du certificat": "nefnsxmgr001.osm03.neofed.local",
      "Date d'expiration du certificat": "2025-01-16"
  },
  {
      "Nombre de jours avant expiration": 695,
      "Nom du certificat": "neosky001.neocorp.intranet.fr",
      "Date d'expiration du certificat": "2025-01-30"
  },
  {
      "Nombre de jours avant expiration": 709,
      "Nom du certificat": "BIGARD webmail.bigard.fr_int_022023",
      "Date d'expiration du certificat": "2025-02-13"
  },
  {
      "Nombre de jours avant expiration": 715,
      "Nom du certificat": "BIGARD Trend Micro ScanMail for Microsoft Exchange",
      "Date d'expiration du certificat": "2025-02-19"
  },
  {
      "Nombre de jours avant expiration": 728,
      "Nom du certificat": "PROCIE PRCMES001",
      "Date d'expiration du certificat": "2025-03-04"
  },
  {
      "Nombre de jours avant expiration": 784,
      "Nom du certificat": "SLEEVER Microsoft Exchange",
      "Date d'expiration du certificat": "2025-04-29"
  },
  {
      "Nombre de jours avant expiration": 784,
      "Nom du certificat": "SLEEVER Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2025-04-29"
  },
  {
      "Nombre de jours avant expiration": 808,
      "Nom du certificat": "SLEEVER WMSVC",
      "Date d'expiration du certificat": "2025-05-23"
  },
  {
      "Nombre de jours avant expiration": 1013,
      "Nom du certificat": "GFM Microsoft Exchange",
      "Date d'expiration du certificat": "2025-12-14"
  },
  {
      "Nombre de jours avant expiration": 1013,
      "Nom du certificat": "GFM Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2025-12-14"
  },
  {
      "Nombre de jours avant expiration": 1232,
      "Nom du certificat": "SLEEVER Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2026-07-21"
  },
  {
      "Nombre de jours avant expiration": 1432,
      "Nom du certificat": "BIGARD Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2027-02-06"
  },
  {
      "Nombre de jours avant expiration": 1434,
      "Nom du certificat": "SLEEVER SMEX",
      "Date d'expiration du certificat": "2027-02-08"
  },
  {
      "Nombre de jours avant expiration": 1435,
      "Nom du certificat": "VIA SANTE Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2027-02-09"
  },
  {
      "Nombre de jours avant expiration": 1440,
      "Nom du certificat": "VIA SANTE Microsoft Exchange",
      "Date d'expiration du certificat": "2027-02-14"
  },
  {
      "Nombre de jours avant expiration": 1539,
      "Nom du certificat": "BIGARD Microsoft Exchange",
      "Date d'expiration du certificat": "2027-05-24"
  },
  {
      "Nombre de jours avant expiration": 1588,
      "Nom du certificat": "CHAABI Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2027-07-12"
  },
  {
      "Nombre de jours avant expiration": 1603,
      "Nom du certificat": "CHAABI Microsoft Exchange",
      "Date d'expiration du certificat": "2027-07-27"
  },
  {
      "Nombre de jours avant expiration": 1738,
      "Nom du certificat": "CFRMES001.AD.INT",
      "Date d'expiration du certificat": "2027-12-09"
  },
  {
      "Nombre de jours avant expiration": 1738,
      "Nom du certificat": "CFRMES002.AD.INT",
      "Date d'expiration du certificat": "2027-12-09"
  },
  {
      "Nombre de jours avant expiration": 1771,
      "Nom du certificat": "PROCIE Microsoft Exchange Server Auth Certificate",
      "Date d'expiration du certificat": "2028-01-11"
  },
  {
      "Nombre de jours avant expiration": 1771,
      "Nom du certificat": "PROCIE PRCMES002",
      "Date d'expiration du certificat": "2028-01-11"
  },
  {
      "Nombre de jours avant expiration": 1771,
      "Nom du certificat": "PROCIE Microsoft Exchange",
      "Date d'expiration du certificat": "2028-01-11"
  },
  {
      "Nombre de jours avant expiration": 1804,
      "Nom du certificat": "PROCIE PRCMES002.thuillier.procie.com",
      "Date d'expiration du certificat": "2028-02-13"
  },
  {
      "Nombre de jours avant expiration": 1804,
      "Nom du certificat": "PROCIE PRCMES001.thuillier.procie.com",
      "Date d'expiration du certificat": "2028-02-13"
  },
  {
      "Nombre de jours avant expiration": 2425,
      "Nom du certificat": "CFR WMSvc-SHA2-CFRMES001",
      "Date d'expiration du certificat": "2029-10-26"
  },
  {
      "Nombre de jours avant expiration": 2425,
      "Nom du certificat": "CFR WMSvc-SHA2-CFRMES002",
      "Date d'expiration du certificat": "2029-10-26"
  },
  {
      "Nombre de jours avant expiration": 2427,
      "Nom du certificat": "AUB-FWL-CFR-ADM_CA2",
      "Date d'expiration du certificat": "2029-10-28"
  },
  {
      "Nombre de jours avant expiration": 3222,
      "Nom du certificat": "RDS - *.ecf-group.local",
      "Date d'expiration du certificat": "2032-01-01"
  },
  {
      "Nombre de jours avant expiration": 4218,
      "Nom du certificat": "PRC Citrix - Citrix",
      "Date d'expiration du certificat": "2034-09-23"
  }
]

 const domaines = [
  {
    "Nom de domaine": "proudreed.com",
    "Date d'expiration du certificat": "30/10/2023",
    "Temps restant": 237,
  },
  {
    "Nom de domaine": "adapei65.fr",
    "Date d'expiration du certificat": "10/02/2024",
    "Temps restant": 340,
  },
    {
    "Nom de domaine": "bredinprat.com",
    "Date d'expiration du certificat": "04/02/2025",
    "Temps restant": 700,
  },
    {
    "Nom de domaine": "fondinvest.com",
    "Date d'expiration du certificat": "26/04/2025",
    "Temps restant": 781,
  },
 
];

const app = express();

// Middleware pour le parsing du corps de la requête
app.use(bodyParser.json());

// Configuration de CORS
app.use(cors());

// Configuration du transporteur de messagerie
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: "zola_andria@outlook.fr",
    pass: process.env.OUTLOOK_PASSWORD,
  }
});

// Route pour récupérer les certificats
app.get('/api/certificates', (req, res) => {
  res.send(certificats);
  res.send(domaines);
});

// Route pour envoyer un mail avec les certificats expirant dans moins de 25 jours
app.post('/api/send-certs', async (req, res) => {
  const certsToRenew = certificats.filter(cert => cert["Nombre de jours avant expiration"] <= 15);

  let mailBody = `<head>
	<meta charset="UTF-8">
	<title>Certificats et domaines expirés</title>
	<style type="text/css">
		body {
			font-family: Times new roman, sans-serif;
			font-size: 14px;
			line-height: 1.5;
			color: #333;
			background-color: #f2f2f2;
		}

		h1 {
			font-size: 24px;
			font-weight: bold;
			text-align: center;
			margin-top: 30px;
			margin-bottom: 30px;
		}

		table {
			width: 100%;
			border-collapse: collapse;
			border-spacing: 0;
			margin-bottom: 30px;
			background-color: #fff;
		}

		table td,
		table th {
			padding: 10px;
			border: 1px solid #ddd;
			text-align: left;
			vertical-align: middle;
			font-size: 14px;
		}

		table th {
			background-color: #f2f2f2;
			color: #333;
			font-weight: bold;
		}

		.warning {
			background-color: #ffe6e6;
			color: #cc0000;
			font-weight: bold;
			padding: 10px;
			margin-bottom: 30px;
			border: 1px solid #cc0000;
			border-radius: 4px;
		}
	</style>
</head>
<body>
<p>Bonjour,</p>
<p>Ci-dessous les certificats et domaines qui seront expirés dans les prochains jours :</p>
<table>
  <thead>
    <tr>
      <th>Certificats</th>
      <th>Date d'expiration</th>
      <th>Temps restant</th>
    </tr>
  </thead>`;

for (let i = 0; i < certsToRenew.length; i++) {
const cert = certsToRenew[i];
mailBody += `
  <tbody>
    <tr>
      <td>${cert['Nom du certificat']}</td>
      <td>${cert['Date d\'expiration du certificat']}</td>
      <td>${cert['Nombre de jours avant expiration']} J</td>
    </tr>
  </tbody>`;
}

mailBody += `</table> <p>Domaines :</p> <table> <thead> <tr> <th>Nom de domaine</th> <th>Date d'expiration</th> <th>Temps restant</th> </tr> </thead>`;
const domsToRenew = domaines.filter(dom => dom["Temps restant"] <= 15);
for (let j = 0; j < domsToRenew.length; j++) {
  const dom = domaines[j];
  mailBody += `
  <tbody> <tr> <td>${dom['Nom de domaine']}</td> <td>${dom['Date d\'expiration du certificat']}</td> <td>${dom['Temps restant']} J</td> </tr> </tbody>`;
}

mailBody += `</table>`;
mailBody += `
<div>
<img src="https://firebasestorage.googleapis.com/v0/b/hosting-app-ee0db.appspot.com/o/550_1019992911.png?alt=media&token=a3288999-de7a-4ec1-8c8d-40245ae2f4fd" alt="source" style="width: 200px; height: auto; margin-right: 10px;">
</div>
<div>
<div style="color: blue; font-weight: bold;">Support Flexible Workspace Services</div>
<div style="color: orange;">Orange Cloud for Business</div>
<div style="color: blue;">helpdesk@neocles.com</div>
<div style="color: orange;">Orange Business Services SA</div>
<div style="color: blue;">Immeuble Terra Nova II – 15 rue Henri Rol-Tanguy 93558 Montreuil</div>
<div style="color: orange;">
  <a href="https://www.orange-business.com/fr/solutions/cloud-computing" style="color: orange; text-decoration: none;">https://www.orange-business.com/fr/solutions/cloud-computing</a>
</div>
</div>
`;

  const message = {
    from: process.env.OUTLOOK_USERNAME,
    to: process.env.RECIPIENT_EMAIL,
    subject: `Vérification quotidienne des certificats et des domaines ce ${today} (${certsToRenew.length} certificats) `,
    html: mailBody
  };

  try {
    await transporter.sendMail(message);
    res.send('Email envoyé avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite lors de l\'envoi de l\'email.');
  }
});

// Planifie l'exécution de la mise à jour chaque jour à minuit
cron.schedule('0 0 * * *', () => {
  const currentDay = moment().locale('fr').format('LL');
  if (currentDay !== today) {
    today = currentDay;
    certificats.forEach(cert => {
      cert["Nombre de jours avant expiration"] -= 1;
    });
    domaines.forEach(dom => {
      dom["Nombre de jours avant expiration"] -= 1;
    });
  }
});

// Route pour mettre à jour manuellement les certificats et les domaines
app.put('/api/update-certs', (req, res) => {
  const currentDay = moment().locale('fr').format('LL');
  if (currentDay !== today) {
    today = currentDay;
    certificats.forEach(cert => {
      cert["Nombre de jours avant expiration"] -= 1;
    });
    domaines.forEach(dom => {
      dom["Nombre de jours avant expiration"] -= 1;
    });
  }
  res.send('Certificats et domaines mis à jour avec succès');
});

// Middleware pour afficher les requêtes reçues
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    next();
  });

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
  });

 // Configuration et initialisation de l'API OpenAI
const openaiConfig = new Configuration({
    organizationId: "org-kDJbLtt6EZiRr2eNhugUibag",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(openaiConfig);
  
  app.post("/chatbot", async (req, res, next) => {
    const { message } = req.body;
  
    try {
      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0,
        max_tokens: 4000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
  
      const botResponse = data.choices[0].text;
      res.json({ botResponse });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  const startServer = async () => {
    try {
      await connectDB(process.env.MONGODB_URL);
      app.listen(port, () =>
        console.log(`Server started on port ${port}`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();