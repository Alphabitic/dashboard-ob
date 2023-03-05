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
moment.locale('fr');

// Utilisation de Moment
const today = moment().locale('fr').format('LL');
dotenv.config();

const certificats = [

  {
   "Nom du certificat": "echanges.ccifinance.fr",
   "Date d'expiration du certificat": "vendredi 17 mars 2023",
   "Nombre de jours avant expiration": 12,
  },
  {
   "Nom du certificat": "ADFS Encryption - Sts.lixir.fr",
   "Date d'expiration du certificat": "dimanche 26 mars 2023",
   "Nombre de jours avant expiration": 21,
  },
  {
   "Nom du certificat": "ADFS Signing - Sts.lixir.fr",
   "Date d'expiration du certificat": "dimanche 26 mars 2023",
   "Nombre de jours avant expiration": 21,
  },
  {
   "Nom du certificat": "CHAABI Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 26 mars 2023",
   "Nombre de jours avant expiration": 21,
  },
  {
   "Nom du certificat": "FRANCE BREVETS Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 26 mars 2023",
   "Nombre de jours avant expiration": 21,
  },
  {
   "Nom du certificat": "SIMT Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 26 mars 2023",
   "Nombre de jours avant expiration": 21,
  },
  {
   "Nom du certificat": "NEOCLES Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "lundi 27 mars 2023",
   "Nombre de jours avant expiration": 22,
  },
  {
   "Nom du certificat": "sts.lixir.fr",
   "Date d'expiration du certificat": "mardi 4 avril 2023",
   "Nombre de jours avant expiration": 30,
  },
  {
   "Nom du certificat": "*.uvet.fr",
   "Date d'expiration du certificat": "mardi 4 avril 2023",
   "Nombre de jours avant expiration": 30,
  },
  {
   "Nom du certificat": "mail-aub-1.neocles.fr",
   "Date d'expiration du certificat": "vendredi 7 avril 2023",
   "Nombre de jours avant expiration": 33,
  },
  {
   "Nom du certificat": "tms.ccifinance.fr",
   "Date d'expiration du certificat": "vendredi 7 avril 2023",
   "Nombre de jours avant expiration": 33,
  },
  {
   "Nom du certificat": "VS-SQLHAM100.VIASANTE.CLOUD",
   "Date d'expiration du certificat": "mardi 11 avril 2023",
   "Nombre de jours avant expiration": 37,
  },
  {
   "Nom du certificat": "VIA SANTE Exchange Delegation Federation",
   "Date d'expiration du certificat": "jeudi 13 avril 2023",
   "Nombre de jours avant expiration": 39,
  },
  {
   "Nom du certificat": "FRANCE BREVETS Microsoft Exchange",
   "Date d'expiration du certificat": "mardi 18 avril 2023",
   "Nombre de jours avant expiration": 44,
  },
  {
   "Nom du certificat": "mail.procie.com",
   "Date d'expiration du certificat": "samedi 29 avril 2023",
   "Nombre de jours avant expiration": 55,
  },
  {
   "Nom du certificat": "mail-ruei-1.neocles.fr",
   "Date d'expiration du certificat": "dimanche 30 avril 2023",
   "Nombre de jours avant expiration": 56,
  },
  {
   "Nom du certificat": "*.neocles.com",
   "Date d'expiration du certificat": "dimanche 30 avril 2023",
   "Nombre de jours avant expiration": 56,
  },
  {
   "Nom du certificat": "GIMC ENVOLUDIA Citrix - *.neocles.com",
   "Date d'expiration du certificat": "dimanche 30 avril 2023",
   "Nombre de jours avant expiration": 56,
  },
  {
   "Nom du certificat": "CCI FINANCE Citrix - *.neocles.com",
   "Date d'expiration du certificat": "dimanche 30 avril 2023",
   "Nombre de jours avant expiration": 56,
  },
  {
   "Nom du certificat": "SAFT *.alcad.com",
   "Date d'expiration du certificat": "vendredi 12 mai 2023",
   "Nombre de jours avant expiration": 68,
  },
  {
   "Nom du certificat": "webmail.viasante.cloud-INT",
   "Date d'expiration du certificat": "vendredi 19 mai 2023",
   "Nombre de jours avant expiration": 75,
  },
  {
   "Nom du certificat": "*.infra.lucas.fr",
   "Date d'expiration du certificat": "lundi 22 mai 2023",
   "Nombre de jours avant expiration": 78,
  },
  {
   "Nom du certificat": "CFR Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 4 juin 2023",
   "Nombre de jours avant expiration": 91,
  },
  {
   "Nom du certificat": "webmail.adapei65.fr",
   "Date d'expiration du certificat": "mardi 6 juin 2023",
   "Nombre de jours avant expiration": 93,
  },
  {
   "Nom du certificat": "Citrix - storefront.regis-location.int",
   "Date d'expiration du certificat": "mercredi 7 juin 2023",
   "Nombre de jours avant expiration": 94,
  },
  {
   "Nom du certificat": "Citrix - *.eri.local",
   "Date d'expiration du certificat": "samedi 17 juin 2023",
   "Nombre de jours avant expiration": 104,
  },
  {
   "Nom du certificat": "Citrix - storefront.lixir.entreprise.dom",
   "Date d'expiration du certificat": "mercredi 21 juin 2023",
   "Nombre de jours avant expiration": 108,
  },
  {
   "Nom du certificat": "WGSLIC02.lixir.entreprise.dom",
   "Date d'expiration du certificat": "mercredi 21 juin 2023",
   "Nombre de jours avant expiration": 108,
  },
  {
   "Nom du certificat": "nefvvc002.osm01.neofed.local",
   "Date d'expiration du certificat": "samedi 24 juin 2023",
   "Nombre de jours avant expiration": 111,
  },
  {
   "Nom du certificat": "webmail.viasante.fr",
   "Date d'expiration du certificat": "dimanche 2 juillet 2023",
   "Nombre de jours avant expiration": 119,
  },
  {
   "Nom du certificat": "*.acpei.pro",
   "Date d'expiration du certificat": "dimanche 2 juillet 2023",
   "Nombre de jours avant expiration": 119,
  },
  {
   "Nom du certificat": "next.envoludia.org",
   "Date d'expiration du certificat": "lundi 10 juillet 2023",
   "Nombre de jours avant expiration": 127,
  },
  {
   "Nom du certificat": "NEO Citrix - Test - STF PKI",
   "Date d'expiration du certificat": "dimanche 16 juillet 2023",
   "Nombre de jours avant expiration": 133,
  },
  {
   "Nom du certificat": "email.banquechaabi.fr-INT",
   "Date d'expiration du certificat": "mercredi 19 juillet 2023",
   "Nombre de jours avant expiration": 136,
  },
  {
   "Nom du certificat": "NEOFED protection-kp",
   "Date d'expiration du certificat": "mercredi 19 juillet 2023",
   "Nombre de jours avant expiration": 136,
  },
  {
   "Nom du certificat": "Citrix - storefront.adapei65.local",
   "Date d'expiration du certificat": "dimanche 23 juillet 2023",
   "Nombre de jours avant expiration": 140,
  },
  {
   "Nom du certificat": "*.videlio.com",
   "Date d'expiration du certificat": "vendredi 28 juillet 2023",
   "Nombre de jours avant expiration": 145,
  },
  {
   "Nom du certificat": "bmcdiscovery.neofed.local",
   "Date d'expiration du certificat": "samedi 29 juillet 2023",
   "Nombre de jours avant expiration": 146,
  },
  {
   "Nom du certificat": "mail.sagess.fr-INT",
   "Date d'expiration du certificat": "mercredi 2 août 2023",
   "Nombre de jours avant expiration": 150,
  },
  {
   "Nom du certificat": "*.sagess.fr",
   "Date d'expiration du certificat": "lundi 7 août 2023",
   "Nombre de jours avant expiration": 155,
  },
  {
   "Nom du certificat": "Citrix - *.sagess.fr",
   "Date d'expiration du certificat": "lundi 7 août 2023",
   "Nombre de jours avant expiration": 155,
  },
  {
   "Nom du certificat": "mail.bredinprat.com-INT",
   "Date d'expiration du certificat": "mercredi 9 août 2023",
   "Nombre de jours avant expiration": 157,
  },
  {
   "Nom du certificat": "nefrub001.neofed.local",
   "Date d'expiration du certificat": "mercredi 9 août 2023",
   "Nombre de jours avant expiration": 157,
  },
  {
   "Nom du certificat": "*.simt.fr",
   "Date d'expiration du certificat": "dimanche 13 août 2023",
   "Nombre de jours avant expiration": 161,
  },
  {
   "Nom du certificat": "webmail.adapei65.fr-INT",
   "Date d'expiration du certificat": "mercredi 23 août 2023",
   "Nombre de jours avant expiration": 171,
  },
  {
   "Nom du certificat": "*.buyin.pro",
   "Date d'expiration du certificat": "mercredi 30 août 2023",
   "Nombre de jours avant expiration": 178,
  },
  {
   "Nom du certificat": "*.eri.fr",
   "Date d'expiration du certificat": "vendredi 8 septembre 2023",
   "Nombre de jours avant expiration": 187,
  },
  {
   "Nom du certificat": "Citrix citrix.neocorp.intranet.fr",
   "Date d'expiration du certificat": "samedi 9 septembre 2023",
   "Nombre de jours avant expiration": 188,
  },
  {
   "Nom du certificat": "*.uniprotect.fr",
   "Date d'expiration du certificat": "dimanche 10 septembre 2023",
   "Nombre de jours avant expiration": 189,
  },
  {
   "Nom du certificat": "simsky001.simt.corp",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "mail.simt.fr-INT",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "mail.ad.int-INT",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "Citrix - workspace.corp.simt.fr",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "CFR DC1-PX-HTTP",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "CFR DC2-PX-HTTP",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "Citrix - storectx.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "ad-CFRADC003-CA",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "CFR Multiple renouvellement de certificats",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "Citrix - director.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "smtp1-esa-in.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "smtp2-esa-in.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "CFRADC001.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "CFRADC002.ad.int",
   "Date d'expiration du certificat": "mardi 26 septembre 2023",
   "Nombre de jours avant expiration": 205,
  },
  {
   "Nom du certificat": "mail.stimtechnibat.fr",
   "Date d'expiration du certificat": "jeudi 28 septembre 2023",
   "Nombre de jours avant expiration": 207,
  },
  {
   "Nom du certificat": "vpn.bredinprat.com",
   "Date d'expiration du certificat": "vendredi 29 septembre 2023",
   "Nombre de jours avant expiration": 208,
  },
  {
   "Nom du certificat": "FRANCE BREVETS webmail.francebrevets.com",
   "Date d'expiration du certificat": "mercredi 4 octobre 2023",
   "Nombre de jours avant expiration": 213,
  },
  {
   "Nom du certificat": "NEO Citrix - Test - store 1909",
   "Date d'expiration du certificat": "mercredi 4 octobre 2023",
   "Nombre de jours avant expiration": 213,
  },
  {
   "Nom du certificat": "nefvvc005.neofed.local",
   "Date d'expiration du certificat": "jeudi 5 octobre 2023",
   "Nombre de jours avant expiration": 214,
  },
  {
   "Nom du certificat": "nefvvc006.osm02.neofed.local",
   "Date d'expiration du certificat": "samedi 7 octobre 2023",
   "Nombre de jours avant expiration": 216,
  },
  {
   "Nom du certificat": "nefvvc007.osm03.neofed.local",
   "Date d'expiration du certificat": "samedi 7 octobre 2023",
   "Nombre de jours avant expiration": 216,
  },
  {
   "Nom du certificat": "RDS - rds.videlio.local",
   "Date d'expiration du certificat": "mercredi 11 octobre 2023",
   "Nombre de jours avant expiration": 220,
  },
  {
   "Nom du certificat": "Citrix - partcitrix.viasante.net",
   "Date d'expiration du certificat": "vendredi 13 octobre 2023",
   "Nombre de jours avant expiration": 222,
  },
  {
   "Nom du certificat": "RDS - *.videlio.local",
   "Date d'expiration du certificat": "samedi 14 octobre 2023",
   "Nombre de jours avant expiration": 223,
  },
  {
   "Nom du certificat": "mail.sd-ingenierie.fr",
   "Date d'expiration du certificat": "lundi 16 octobre 2023",
   "Nombre de jours avant expiration": 225,
  },
  {
   "Nom du certificat": "bureau.silabel.fr",
   "Date d'expiration du certificat": "mardi 17 octobre 2023",
   "Nombre de jours avant expiration": 226,
  },
  {
   "Nom du certificat": "mail.capeb-vendee.fr",
   "Date d'expiration du certificat": "samedi 21 octobre 2023",
   "Nombre de jours avant expiration": 230,
  },
  {
   "Nom du certificat": "mail.eviafoods.com",
   "Date d'expiration du certificat": "samedi 21 octobre 2023",
   "Nombre de jours avant expiration": 230,
  },
  {
   "Nom du certificat": "mail.fondinvest.com",
   "Date d'expiration du certificat": "samedi 21 octobre 2023",
   "Nombre de jours avant expiration": 230,
  },
  {
   "Nom du certificat": "email.banquechaabi.fr",
   "Date d'expiration du certificat": "mercredi 25 octobre 2023",
   "Nombre de jours avant expiration": 234,
  },
  {
   "Nom du certificat": "mail.uniprotect.fr",
   "Date d'expiration du certificat": "vendredi 3 novembre 2023",
   "Nombre de jours avant expiration": 243,
  },
  {
   "Nom du certificat": "SAGESS AzureRunAsCertificate",
   "Date d'expiration du certificat": "mercredi 8 novembre 2023",
   "Nombre de jours avant expiration": 248,
  },
  {
   "Nom du certificat": "webmail.bredinprat.com",
   "Date d'expiration du certificat": "mardi 28 novembre 2023",
   "Nombre de jours avant expiration": 268,
  },
  {
   "Nom du certificat": "ged.resah.fr",
   "Date d'expiration du certificat": "jeudi 30 novembre 2023",
   "Nombre de jours avant expiration": 270,
  },
  {
   "Nom du certificat": "*.adapei65.fr",
   "Date d'expiration du certificat": "vendredi 1 décembre 2023",
   "Nombre de jours avant expiration": 271,
  },
  {
   "Nom du certificat": "Citrix - *.gfm-mut.com",
   "Date d'expiration du certificat": "samedi 9 décembre 2023",
   "Nombre de jours avant expiration": 279,
  },
  {
   "Nom du certificat": "VIS Citrix - app-citrix.viasante.cloud",
   "Date d'expiration du certificat": "dimanche 17 décembre 2023",
   "Nombre de jours avant expiration": 287,
  },
  {
   "Nom du certificat": "mail.bredinprat.com",
   "Date d'expiration du certificat": "dimanche 17 décembre 2023",
   "Nombre de jours avant expiration": 287,
  },
  {
   "Nom du certificat": "VIS Citrix Director - app-citrixdirector",
   "Date d'expiration du certificat": "dimanche 17 décembre 2023",
   "Nombre de jours avant expiration": 287,
  },
  {
   "Nom du certificat": "vs-lic001.viasante.cloud",
   "Date d'expiration du certificat": "dimanche 17 décembre 2023",
   "Nombre de jours avant expiration": 287,
  },
  {
   "Nom du certificat": "*.banquerichelieu.com",
   "Date d'expiration du certificat": "dimanche 24 décembre 2023",
   "Nombre de jours avant expiration": 294,
  },
  {
   "Nom du certificat": "francemutuelle.fr",
   "Date d'expiration du certificat": "samedi 30 décembre 2023",
   "Nombre de jours avant expiration": 300,
  },
  {
   "Nom du certificat": "*.proudreed.com",
   "Date d'expiration du certificat": "lundi 8 janvier 2024",
   "Nombre de jours avant expiration": 309,
  },
  {
   "Nom du certificat": "cashpooler.ccifinance.fr",
   "Date d'expiration du certificat": "jeudi 11 janvier 2024",
   "Nombre de jours avant expiration": 312,
  },
  {
   "Nom du certificat": "rec-cashpooler.ccifinance.fr",
   "Date d'expiration du certificat": "mardi 30 janvier 2024",
   "Nombre de jours avant expiration": 331,
  },
  {
   "Nom du certificat": "cloud-tms.valeo.com",
   "Date d'expiration du certificat": "jeudi 1 février 2024",
   "Nombre de jours avant expiration": 333,
  },
  {
   "Nom du certificat": "mail.procie.com-INT",
   "Date d'expiration du certificat": "jeudi 1 février 2024",
   "Nombre de jours avant expiration": 333,
  },
  {
   "Nom du certificat": "cloud-tms-ext.valeo.com",
   "Date d'expiration du certificat": "jeudi 1 février 2024",
   "Nombre de jours avant expiration": 333,
  },
  {
   "Nom du certificat": "*.sleever.com",
   "Date d'expiration du certificat": "vendredi 2 février 2024",
   "Nombre de jours avant expiration": 334,
  },
  {
   "Nom du certificat": "Citrix - *.sleever.com",
   "Date d'expiration du certificat": "vendredi 2 février 2024",
   "Nombre de jours avant expiration": 334,
  },
  {
   "Nom du certificat": "RDS - syrbrk001.bureautique.intra",
   "Date d'expiration du certificat": "vendredi 2 février 2024",
   "Nombre de jours avant expiration": 334,
  },
  {
   "Nom du certificat": "AD10-SLEEVER.sleever.local",
   "Date d'expiration du certificat": "mercredi 7 février 2024",
   "Nombre de jours avant expiration": 339,
  },
  {
   "Nom du certificat": "*.cpssp.fr",
   "Date d'expiration du certificat": "dimanche 11 février 2024",
   "Nombre de jours avant expiration": 343,
  },
  {
   "Nom du certificat": "mail.neocles.fr-INT",
   "Date d'expiration du certificat": "jeudi 15 février 2024",
   "Nombre de jours avant expiration": 347,
  },
  {
   "Nom du certificat": "neosky002.neocorp.intranet.fr",
   "Date d'expiration du certificat": "jeudi 15 février 2024",
   "Nombre de jours avant expiration": 347,
  },
  {
   "Nom du certificat": "neowac001.neocorp.intranet.fr",
   "Date d'expiration du certificat": "jeudi 15 février 2024",
   "Nombre de jours avant expiration": 347,
  },
  {
   "Nom du certificat": "RDS - *.carced.local",
   "Date d'expiration du certificat": "vendredi 16 février 2024",
   "Nombre de jours avant expiration": 348,
  },
  {
   "Nom du certificat": "*.metaldeploye.com",
   "Date d'expiration du certificat": "dimanche 18 février 2024",
   "Nombre de jours avant expiration": 350,
  },
  {
   "Nom du certificat": "*.adgessa.fr",
   "Date d'expiration du certificat": "mercredi 21 février 2024",
   "Nombre de jours avant expiration": 353,
  },
  {
   "Nom du certificat": "GFMMES004.gfm-mut.com",
   "Date d'expiration du certificat": "vendredi 23 février 2024",
   "Nombre de jours avant expiration": 355,
  },
  {
   "Nom du certificat": "a65oct001",
   "Date d'expiration du certificat": "samedi 24 février 2024",
   "Nombre de jours avant expiration": 356,
  },
  {
   "Nom du certificat": "BIGARD webmail.bigard.fr",
   "Date d'expiration du certificat": "vendredi 1 mars 2024",
   "Nombre de jours avant expiration": 362,
  },
  {
   "Nom du certificat": "mail.nidek.fr-INT",
   "Date d'expiration du certificat": "samedi 2 mars 2024",
   "Nombre de jours avant expiration": 363,
  },
  {
   "Nom du certificat": "mail.nidek.fr",
   "Date d'expiration du certificat": "mardi 5 mars 2024",
   "Nombre de jours avant expiration": 366,
  },
  {
   "Nom du certificat": "mail.francemutuelle.fr-INT",
   "Date d'expiration du certificat": "vendredi 8 mars 2024",
   "Nombre de jours avant expiration": 369,
  },
  {
   "Nom du certificat": "citrix.bredinprat.com",
   "Date d'expiration du certificat": "vendredi 15 mars 2024",
   "Nombre de jours avant expiration": 376,
  },
  {
   "Nom du certificat": "Citrix - storefront.stim.local",
   "Date d'expiration du certificat": "vendredi 19 avril 2024",
   "Nombre de jours avant expiration": 411,
  },
  {
   "Nom du certificat": "mail.stimtechnibat.fr-INT",
   "Date d'expiration du certificat": "samedi 6 juillet 2024",
   "Nombre de jours avant expiration": 489,
  },
  {
   "Nom du certificat": "CAPEB Citrix - storefront",
   "Date d'expiration du certificat": "mercredi 31 juillet 2024",
   "Nombre de jours avant expiration": 514,
  },
  {
   "Nom du certificat": "Citrix - storefront.ocspecial.local",
   "Date d'expiration du certificat": "dimanche 4 août 2024",
   "Nombre de jours avant expiration": 518,
  },
  {
   "Nom du certificat": "mail.sd-ingenierie.fr-INT",
   "Date d'expiration du certificat": "samedi 24 août 2024",
   "Nombre de jours avant expiration": 538,
  },
  {
   "Nom du certificat": "mail.uniprotect.fr-INT",
   "Date d'expiration du certificat": "dimanche 25 août 2024",
   "Nombre de jours avant expiration": 539,
  },
  {
   "Nom du certificat": "nefnoc002.neofed.local",
   "Date d'expiration du certificat": "lundi 26 août 2024",
   "Nombre de jours avant expiration": 540,
  },
  {
   "Nom du certificat": "UNIPROTECT Citrix - storefront",
   "Date d'expiration du certificat": "jeudi 29 août 2024",
   "Nombre de jours avant expiration": 543,
  },
  {
   "Nom du certificat": "INTERCARGO Citrix - Storefront",
   "Date d'expiration du certificat": "jeudi 29 août 2024",
   "Nombre de jours avant expiration": 543,
  },
  {
   "Nom du certificat": "mail.eviafoods.com-INT",
   "Date d'expiration du certificat": "mercredi 4 septembre 2024",
   "Nombre de jours avant expiration": 549,
  },
  {
   "Nom du certificat": "mail.capeb-vendee.fr-INT",
   "Date d'expiration du certificat": "samedi 7 septembre 2024",
   "Nombre de jours avant expiration": 552,
  },
  {
   "Nom du certificat": "mail.fondinvest.com-INT",
   "Date d'expiration du certificat": "samedi 7 septembre 2024",
   "Nombre de jours avant expiration": 552,
  },
  {
   "Nom du certificat": "TECHNIC DSG Citrix - storefront",
   "Date d'expiration du certificat": "mercredi 18 septembre 2024",
   "Nombre de jours avant expiration": 563,
  },
  {
   "Nom du certificat": "*.neofed.local",
   "Date d'expiration du certificat": "jeudi 19 septembre 2024",
   "Nombre de jours avant expiration": 564,
  },
  {
   "Nom du certificat": "FONDINVEST Citrix - storefront",
   "Date d'expiration du certificat": "vendredi 20 septembre 2024",
   "Nombre de jours avant expiration": 565,
  },
  {
   "Nom du certificat": "SD INGENIERIE Citrix - storefront.",
   "Date d'expiration du certificat": "jeudi 26 septembre 2024",
   "Nombre de jours avant expiration": 571,
  },
  {
   "Nom du certificat": "CFR Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "jeudi 3 octobre 2024",
   "Nombre de jours avant expiration": 578,
  },
  {
   "Nom du certificat": "GESTIPRO Citrix - Storefront",
   "Date d'expiration du certificat": "mercredi 9 octobre 2024",
   "Nombre de jours avant expiration": 584,
  },
  {
   "Nom du certificat": "EVIA FOODS Citrix - storefront",
   "Date d'expiration du certificat": "mercredi 9 octobre 2024",
   "Nombre de jours avant expiration": 584,
  },
  {
   "Nom du certificat": "Citrix storefront.neocorp.intranet.fr",
   "Date d'expiration du certificat": "vendredi 18 octobre 2024",
   "Nombre de jours avant expiration": 593,
  },
  {
   "Nom du certificat": "Citrix - ddslogistics-DDSADC01-CA",
   "Date d'expiration du certificat": "mercredi 23 octobre 2024",
   "Nombre de jours avant expiration": 598,
  },
  {
   "Nom du certificat": "CFRMES002",
   "Date d'expiration du certificat": "mercredi 30 octobre 2024",
   "Nombre de jours avant expiration": 605,
  },
  {
   "Nom du certificat": "Citrix - storefront.proudreed.local",
   "Date d'expiration du certificat": "jeudi 31 octobre 2024",
   "Nombre de jours avant expiration": 606,
  },
  {
   "Nom du certificat": "mail.eri.fr-INT",
   "Date d'expiration du certificat": "jeudi 14 novembre 2024",
   "Nombre de jours avant expiration": 620,
  },
  {
   "Nom du certificat": "CFRPKI001-CA",
   "Date d'expiration du certificat": "lundi 25 novembre 2024",
   "Nombre de jours avant expiration": 631,
  },
  {
   "Nom du certificat": "CFRMES001",
   "Date d'expiration du certificat": "samedi 7 décembre 2024",
   "Nombre de jours avant expiration": 643,
  },
  {
   "Nom du certificat": "IZARET Citrix - workspace",
   "Date d'expiration du certificat": "samedi 4 janvier 2025",
   "Nombre de jours avant expiration": 671,
  },
  {
   "Nom du certificat": "slemes001.sleever.local",
   "Date d'expiration du certificat": "mercredi 15 janvier 2025",
   "Nombre de jours avant expiration": 682,
  },
  {
   "Nom du certificat": "nefnsxmgr001.osm03.neofed.local",
   "Date d'expiration du certificat": "jeudi 16 janvier 2025",
   "Nombre de jours avant expiration": 683,
  },
  {
   "Nom du certificat": "neosky001.neocorp.intranet.fr",
   "Date d'expiration du certificat": "jeudi 30 janvier 2025",
   "Nombre de jours avant expiration": 697,
  },
  {
   "Nom du certificat": "BIGARD webmail.bigard.fr_int_022023",
   "Date d'expiration du certificat": "jeudi 13 février 2025",
   "Nombre de jours avant expiration": 711,
  },
  {
   "Nom du certificat": "BIGARD Trend Micro ScanMail for Microsoft Exchange",
   "Date d'expiration du certificat": "mercredi 19 février 2025",
   "Nombre de jours avant expiration": 717,
  },
  {
   "Nom du certificat": "PROCIE PRCMES001",
   "Date d'expiration du certificat": "mardi 4 mars 2025",
   "Nombre de jours avant expiration": 730,
  },
  {
   "Nom du certificat": "SLEEVER Microsoft Exchange",
   "Date d'expiration du certificat": "mardi 29 avril 2025",
   "Nombre de jours avant expiration": 786,
  },
  {
   "Nom du certificat": "SLEEVER Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "mardi 29 avril 2025",
   "Nombre de jours avant expiration": 786,
  },
  {
   "Nom du certificat": "SLEEVER WMSVC",
   "Date d'expiration du certificat": "vendredi 23 mai 2025",
   "Nombre de jours avant expiration": 810,
  },
  {
   "Nom du certificat": "GFM Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 14 décembre 2025",
   "Nombre de jours avant expiration": 1015,
  },
  {
   "Nom du certificat": "GFM Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "dimanche 14 décembre 2025",
   "Nombre de jours avant expiration": 1015,
  },
  {
   "Nom du certificat": "SLEEVER Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "mardi 21 juillet 2026",
   "Nombre de jours avant expiration": 1234,
  },
  {
   "Nom du certificat": "BIGARD Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "samedi 6 février 2027",
   "Nombre de jours avant expiration": 1434,
  },
  {
   "Nom du certificat": "SLEEVER SMEX",
   "Date d'expiration du certificat": "lundi 8 février 2027",
   "Nombre de jours avant expiration": 1436,
  },
  {
   "Nom du certificat": "VIA SANTE Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "mardi 9 février 2027",
   "Nombre de jours avant expiration": 1437,
  },
  {
   "Nom du certificat": "VIA SANTE Microsoft Exchange",
   "Date d'expiration du certificat": "dimanche 14 février 2027",
   "Nombre de jours avant expiration": 1442,
  },
  {
   "Nom du certificat": "BIGARD Microsoft Exchange",
   "Date d'expiration du certificat": "lundi 24 mai 2027",
   "Nombre de jours avant expiration": 1541,
  },
  {
   "Nom du certificat": "CHAABI Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "lundi 12 juillet 2027",
   "Nombre de jours avant expiration": 1590,
  },
  {
   "Nom du certificat": "CHAABI Microsoft Exchange",
   "Date d'expiration du certificat": "mardi 27 juillet 2027",
   "Nombre de jours avant expiration": 1605,
  },
  {
   "Nom du certificat": "CFRMES001.AD.INT",
   "Date d'expiration du certificat": "jeudi 9 décembre 2027",
   "Nombre de jours avant expiration": 1740,
  },
  {
   "Nom du certificat": "CFRMES002.AD.INT",
   "Date d'expiration du certificat": "jeudi 9 décembre 2027",
   "Nombre de jours avant expiration": 1740,
  },
  {
   "Nom du certificat": "PROCIE Microsoft Exchange Server Auth Certificate",
   "Date d'expiration du certificat": "mardi 11 janvier 2028",
   "Nombre de jours avant expiration": 1773,
  },
  {
   "Nom du certificat": "PROCIE PRCMES002",
   "Date d'expiration du certificat": "mardi 11 janvier 2028",
   "Nombre de jours avant expiration": 1773,
  },
  {
   "Nom du certificat": "PROCIE Microsoft Exchange",
   "Date d'expiration du certificat": "mardi 11 janvier 2028",
   "Nombre de jours avant expiration": 1773,
  },
  {
   "Nom du certificat": "PROCIE PRCMES002.thuillier.procie.com",
   "Date d'expiration du certificat": "dimanche 13 février 2028",
   "Nombre de jours avant expiration": 1806,
  },
  {
   "Nom du certificat": "PROCIE PRCMES001.thuillier.procie.com",
   "Date d'expiration du certificat": "dimanche 13 février 2028",
   "Nombre de jours avant expiration": 1806,
  },
  {
   "Nom du certificat": "CFR WMSvc-SHA2-CFRMES001",
   "Date d'expiration du certificat": "vendredi 26 octobre 2029",
   "Nombre de jours avant expiration": 2427,
  },
  {
   "Nom du certificat": "CFR WMSvc-SHA2-CFRMES002",
   "Date d'expiration du certificat": "vendredi 26 octobre 2029",
   "Nombre de jours avant expiration": 2427,
  },
  {
   "Nom du certificat": "AUB-FWL-CFR-ADM_CA2",
   "Date d'expiration du certificat": "dimanche 28 octobre 2029",
   "Nombre de jours avant expiration": 2429,
  },
  {
   "Nom du certificat": "RDS - *.ecf-group.local",
   "Date d'expiration du certificat": "jeudi 1 janvier 2032",
   "Nombre de jours avant expiration": 3224,
  },
  {
   "Nom du certificat": "PRC Citrix - Citrix",
   "Date d'expiration du certificat": "samedi 23 septembre 2034",
   "Nombre de jours avant expiration": 4220,
  }
 ]

 const domaines = [
  {
    "Nom de domaine": "proudreed.com",
    "Date d'expiration du certificat": "30/10/2023",
    "Temps restant": 238,
  },
  {
    "Nom de domaine": "adapei65.fr",
    "Date d'expiration du certificat": "10/02/2024",
    "Temps restant": 341,
  },
    {
    "Nom de domaine": "bredinprat.com",
    "Date d'expiration du certificat": "04/02/2025",
    "Temps restant": 701,
  },
    {
    "Nom de domaine": "fondinvest.com",
    "Date d'expiration du certificat": "26/04/2025",
    "Temps restant": 782,
  },
 
];

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Middleware pour le parsing du corps de la requête
app.use(bodyParser.json());



// Configuration du transporteur de messagerie
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_USERNAME,
    pass: process.env.OUTLOOK_PASSWORD
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

// Route pour mettre à jour le nombre de jours avant expiration chaque jour à minuit
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
  res.send('Certificats et domaines misent à jour avec succès');
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
      app.listen(PORT, () =>
        console.log("Server started on port http://localhost:8080")
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();