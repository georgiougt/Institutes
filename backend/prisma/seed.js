"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding the database...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edutrack.com' },
        update: {},
        create: {
            email: 'admin@edutrack.com',
            firstName: 'Admin',
            lastName: 'User',
            role: client_1.Role.ADMIN,
            adminRole: 'SUPER_ADMIN',
            passwordHash,
        },
    });
    const owner1 = await prisma.user.upsert({
        where: { email: 'giorgos@test.com' },
        update: {},
        create: {
            email: 'giorgos@test.com',
            firstName: 'Γιώργος',
            lastName: 'Παπαδόπουλος',
            role: client_1.Role.OWNER,
            passwordHash,
        },
    });
    const owner2 = await prisma.user.upsert({
        where: { email: 'maria@test.com' },
        update: {},
        create: {
            email: 'maria@test.com',
            firstName: 'Μαρία',
            lastName: 'Κωνσταντίνου',
            role: client_1.Role.OWNER,
            passwordHash,
        },
    });
    const nicosia = await prisma.city.upsert({
        where: { name: 'Λευκωσία' },
        update: {},
        create: {
            name: 'Λευκωσία',
            nameEn: 'Nicosia',
            areas: {
                create: [
                    { name: 'Στρόβολος', nameEn: 'Strovolos' },
                    { name: 'Λακατάμια', nameEn: 'Lakatamia' },
                    { name: 'Λατσιά', nameEn: 'Latsia' },
                    { name: 'Αγλαντζιά', nameEn: 'Aglantzia' },
                    { name: 'Έγκωμη', nameEn: 'Engomi' },
                ]
            }
        }
    });
    const limassol = await prisma.city.upsert({
        where: { name: 'Λεμεσός' },
        update: {},
        create: {
            name: 'Λεμεσός',
            nameEn: 'Limassol',
            areas: {
                create: [
                    { name: 'Γερμασόγεια', nameEn: 'Germasogeia' },
                    { name: 'Άγιος Αθανάσιος', nameEn: 'Agios Athanasios' },
                    { name: 'Μέσα Γειτονιά', nameEn: 'Mesa Geitonia' },
                ]
            }
        }
    });
    const larnaca = await prisma.city.upsert({
        where: { name: 'Λάρνακα' },
        update: {},
        create: {
            name: 'Λάρνακα',
            nameEn: 'Larnaca',
            areas: {
                create: [
                    { name: 'Δρομολαξιά', nameEn: 'Dromolaxia' },
                    { name: 'Αραδίππου', nameEn: 'Aradippou' },
                ]
            }
        }
    });
    const paphos = await prisma.city.upsert({
        where: { name: 'Πάφος' },
        update: {},
        create: {
            name: 'Πάφος',
            nameEn: 'Paphos',
        }
    });
    const famagusta = await prisma.city.upsert({
        where: { name: 'Αμμόχωστος' },
        update: {},
        create: {
            name: 'Αμμόχωστος',
            nameEn: 'Famagusta',
        }
    });
    const services = await Promise.all([
        prisma.service.upsert({ where: { name: 'Μαθηματικά' }, update: {}, create: { name: 'Μαθηματικά', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Αγγλικά' }, update: {}, create: { name: 'Αγγλικά', category: 'Ξένες Γλώσσες' } }),
        prisma.service.upsert({ where: { name: 'Φυσική' }, update: {}, create: { name: 'Φυσική', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Χημεία' }, update: {}, create: { name: 'Χημεία', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Πληροφορική' }, update: {}, create: { name: 'Πληροφορική', category: 'Τεχνολογία' } }),
        prisma.service.upsert({ where: { name: 'Ελληνικά' }, update: {}, create: { name: 'Ελληνικά', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Γαλλικά' }, update: {}, create: { name: 'Γαλλικά', category: 'Ξένες Γλώσσες' } }),
        prisma.service.upsert({ where: { name: 'Βιολογία' }, update: {}, create: { name: 'Βιολογία', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Ιστορία' }, update: {}, create: { name: 'Ιστορία', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Λογιστική' }, update: {}, create: { name: 'Λογιστική', category: 'Επαγγελματικά' } }),
        prisma.service.upsert({ where: { name: 'Αρχαία Ελληνικά' }, update: {}, create: { name: 'Αρχαία Ελληνικά', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Λατινικά' }, update: {}, create: { name: 'Λατινικά', category: 'Μέση Εκπαίδευση' } }),
        prisma.service.upsert({ where: { name: 'Ρωσικά' }, update: {}, create: { name: 'Ρωσικά', category: 'Ξένες Γλώσσες' } }),
        prisma.service.upsert({ where: { name: 'Γερμανικά' }, update: {}, create: { name: 'Γερμανικά', category: 'Ξένες Γλώσσες' } }),
    ]);
    const demoInstitutes = [
        { name: 'Φροντιστήριο Διάκριση', desc: 'Εξειδίκευση στις Παγκύπριες εξετάσεις με έμπειρο προσωπικό.', status: client_1.ListingStatus.PENDING, owner: owner1, city: nicosia, lat: 35.167, lng: 33.382, addr: 'Λεωφόρος Μακαρίου Γ΄ 120' },
        { name: 'Λεξιμάθεια', desc: 'Το καλύτερο Κέντρο Ξένων Γλωσσών στη Λεμεσό.', status: client_1.ListingStatus.APPROVED, owner: owner2, city: limassol, lat: 34.684, lng: 33.037, addr: 'Ανεξαρτησίας 50' },
        { name: 'Εκπαιδευτικό Κέντρο Πρόοδος', desc: 'Ολοκληρωμένη υποστήριξη για μαθητές Γυμνασίου και Λυκείου.', status: client_1.ListingStatus.APPROVED, owner: owner1, city: nicosia, lat: 35.160, lng: 33.370, addr: 'Γρίβα Διγενή 45' },
        { name: 'Expert Languages', desc: 'Πρωτοποριακές μέθοδοι εκμάθησης γλωσσών.', status: client_1.ListingStatus.APPROVED, owner: owner2, city: larnaca, lat: 34.916, lng: 33.634, addr: 'Φανερωμένης 12' },
        { name: 'Πρότυπο Φροντιστήριο Θετικών', desc: 'Εστίαση στις Φυσικομαθηματικές επιστήμες.', status: client_1.ListingStatus.APPROVED, owner: owner1, city: nicosia, lat: 35.172, lng: 33.365, addr: 'Λεωφόρος Λεμεσού 80' },
        { name: 'Κέντρο Μελέτης Ορόσημο', desc: 'Βοήθεια στην καθημερινή μελέτη και προετοιμασία.', status: client_1.ListingStatus.APPROVED, owner: owner2, city: limassol, lat: 34.690, lng: 33.045, addr: 'Αρχιεπισκόπου Μακαρίου 15' },
        { name: 'Σύγχρονο Κέντρο Πληροφορικής', desc: 'Πιστοποιήσεις πληροφορικής και μαθήματα ρομποτικής.', status: client_1.ListingStatus.APPROVED, owner: owner1, city: larnaca, lat: 34.920, lng: 33.629, addr: 'Ζήνωνος Κιτιέως 100' },
        { name: 'Φροντιστήριο Άριστα', desc: 'Εγγυημένη επιτυχία στις εξετάσεις.', status: client_1.ListingStatus.PENDING, owner: owner2, city: paphos, lat: 34.776, lng: 32.424, addr: 'Ποσειδώνος 20' },
        { name: 'Linguist Centre', desc: 'Εξειδίκευση σε Αγγλική, Γαλλική και Γερμανική γλώσσα.', status: client_1.ListingStatus.APPROVED, owner: owner1, city: nicosia, lat: 35.155, lng: 33.390, addr: 'Κένεντι 30' },
        { name: 'Εκπαιδευτήρια Νέα Γενιά', desc: 'Περιβάλλον μάθησης και προσωπικής ανάπτυξης.', status: client_1.ListingStatus.REJECTED, owner: owner2, city: limassol, lat: 34.680, lng: 33.050, addr: 'Σπύρου Αραούζου 60' },
        { name: 'Φιλολογικό Φροντιστήριο', desc: 'Εμβάθυνση στα Αρχαία και Νέα Ελληνικά.', status: client_1.ListingStatus.APPROVED, owner: owner1, city: famagusta, lat: 35.117, lng: 33.941, addr: 'Λεωφόρος Δημοκρατίας 5' },
        { name: 'Κέντρο Εκπαίδευσης Λάρνακα', desc: 'Εξατομικευμένη φροντίδα για κάθε μαθητή.', status: client_1.ListingStatus.APPROVED, owner: owner2, city: larnaca, lat: 34.910, lng: 33.640, addr: 'Αθηνών 25' },
    ];
    for (let i = 0; i < demoInstitutes.length; i++) {
        const d = demoInstitutes[i];
        const existing = await prisma.institute.findFirst({ where: { name: d.name } });
        if (existing)
            continue;
        await prisma.institute.create({
            data: {
                name: d.name,
                description: d.desc,
                status: d.status,
                ownerId: d.owner.id,
                images: {
                    create: {
                        url: `https://images.unsplash.com/photo-${[
                            '1503676260728-1c00da096a0b', '1524995997946-a1c2e315a42f', '1509062522246-3755977927d7',
                            '1517694712202-14dd9538aa97', '1497633762265-9d179a990aa6', '1585432959449-347525f21626',
                            '1546410531-bc666a1a4574', '1516321318423-f06f85e504b3', '1523240795612-9a054b0db644', '1532012197267-da84d127e765',
                            '1503676260728-1c00da096a0b', '1524995997946-a1c2e315a42f'
                        ][i]}?q=80&w=600&auto=format&fit=crop`,
                        caption: d.name
                    }
                },
                branches: {
                    create: {
                        name: 'Κεντρικό',
                        phone: `${d.city.nameEn === 'Nicosia' ? '22' : d.city.nameEn === 'Famagusta' ? '23' : d.city.nameEn === 'Limassol' ? '25' : d.city.nameEn === 'Larnaca' ? '24' : '26'}${Math.floor(100000 + Math.random() * 900000)}`,
                        address: d.addr,
                        cityId: d.city.id,
                        latitude: d.lat,
                        longitude: d.lng,
                        isMain: true,
                    }
                },
                services: {
                    create: [
                        { serviceId: services[i % services.length].id },
                        { serviceId: services[(i + 3) % services.length].id },
                    ]
                }
            }
        });
    }
    await prisma.contactRequest.createMany({
        data: [
            { instituteId: (await prisma.institute.findFirst({ where: { name: 'Λεξιμάθεια' } })).id, guestName: 'Ανδρέας', guestEmail: 'andreas@test.com', message: 'Θέλω πληροφορίες για μαθήματα αγγλικών.', status: 'NEW' },
            { instituteId: (await prisma.institute.findFirst({ where: { name: 'Λεξιμάθεια' } })).id, guestName: 'Ελένη', guestEmail: 'eleni@test.com', message: 'Ποια είναι τα κόστη για ενήλικες;', status: 'READ' },
        ]
    });
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map