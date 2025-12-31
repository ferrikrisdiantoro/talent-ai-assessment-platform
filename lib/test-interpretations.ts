/**
 * Test-Specific Interpretations
 * Provides interpretation text for each assessment module based on score levels
 */

export type ScoreLevel = 'High' | 'Medium' | 'Low'

export interface DimensionInterpretation {
    high: string
    medium: string
    low: string
}

export interface ModuleInterpretation {
    name: string
    description: string
    dimensions: Record<string, DimensionInterpretation>
}

/**
 * Get score level based on normalized score (0-100)
 */
export function getScoreLevel(score: number): ScoreLevel {
    if (score >= 71) return 'High'
    if (score >= 41) return 'Medium'
    return 'Low'
}

/**
 * Interpretation database for all assessment modules
 */
export const INTERPRETATIONS: Record<string, ModuleInterpretation> = {
    // DISC Personality Profile
    'PER-02': {
        name: 'Profil DISC',
        description: 'Gaya interaksi dan komunikasi dalam lingkungan kerja',
        dimensions: {
            'Dominance': {
                high: 'Tegas, kompetitif, dan berorientasi pada hasil. Suka mengambil tantangan dan memimpin. Cenderung langsung dalam komunikasi dan fokus pada pencapaian target.',
                medium: 'Memiliki keseimbangan antara ketegasan dan fleksibilitas. Dapat mengambil inisiatif namun juga mampu bekerja sama dengan baik.',
                low: 'Kooperatif, sabar, dan menghindari konflik. Lebih nyaman sebagai pendukung tim daripada pemimpin. Cenderung diplomatis dalam pendekatan.'
            },
            'Influence': {
                high: 'Antusias, persuasif, dan pandai bergaul. Mampu memotivasi orang lain dan membangun jaringan dengan mudah. Suka bekerja dalam tim dan lingkungan sosial.',
                medium: 'Cukup ramah dan komunikatif. Dapat berinteraksi dengan baik namun juga nyaman bekerja mandiri.',
                low: 'Lebih suka fakta daripada emosi. Cenderung analitis dan objektif. Lebih nyaman bekerja sendiri atau dalam kelompok kecil.'
            },
            'Steadiness': {
                high: 'Stabil, sabar, dan dapat diandalkan. Loyal terhadap tim dan organisasi. Suka lingkungan kerja yang terstruktur dan dapat diprediksi.',
                medium: 'Fleksibel dalam menghadapi perubahan namun tetap menghargai stabilitas. Dapat beradaptasi dengan berbagai situasi.',
                low: 'Dinamis dan menyukai perubahan. Mudah bosan dengan rutinitas. Suka tantangan baru dan variasi dalam pekerjaan.'
            },
            'Compliance': {
                high: 'Teliti, akurat, dan mengikuti prosedur. Kritis dalam menganalisis dan memperhatikan detail. Mengutamakan kualitas dan standar tinggi.',
                medium: 'Menghargai aturan namun tidak kaku. Dapat bekerja dengan standar yang ditetapkan sambil tetap fleksibel.',
                low: 'Independen dan kreatif. Lebih suka pendekatan informal. Cenderung menantang aturan yang tidak masuk akal.'
            }
        }
    },

    // Big Five Personality
    'PER-01': {
        name: 'Profil Big Five',
        description: 'Lima dimensi kepribadian utama dalam konteks profesional',
        dimensions: {
            'Openness': {
                high: 'Kreatif, imajinatif, dan terbuka terhadap pengalaman baru. Suka eksplorasi ide dan pendekatan inovatif. Cenderung berpikir abstrak.',
                medium: 'Seimbang antara tradisi dan inovasi. Dapat menerima ide baru namun juga menghargai cara-cara yang sudah terbukti.',
                low: 'Praktis, konvensional, dan fokus pada hal konkret. Lebih suka metode yang sudah teruji daripada eksperimen.'
            },
            'Conscientiousness': {
                high: 'Terorganisir, disiplin, dan bertanggung jawab. Dapat diandalkan untuk menyelesaikan tugas tepat waktu. Berorientasi pada detail.',
                medium: 'Cukup teratur dan dapat diandalkan. Mampu menyeimbangkan fleksibilitas dengan struktur.',
                low: 'Fleksibel dan spontan. Lebih suka pendekatan yang tidak terlalu terstruktur. Mungkin perlu bantuan dalam pengorganisasian.'
            },
            'Extraversion': {
                high: 'Energik, ramah, dan suka bersosialisasi. Nyaman dalam kelompok besar dan situasi sosial. Cenderung asertif.',
                medium: 'Dapat bersosialisasi dengan baik namun juga menikmati waktu sendiri. Seimbang antara interaksi sosial dan refleksi.',
                low: 'Tenang, reflektif, dan lebih suka lingkungan yang tenang. Menikmati kesendirian dan pekerjaan mandiri.'
            },
            'Agreeableness': {
                high: 'Kooperatif, empatik, dan mudah percaya. Mengutamakan harmoni dan hubungan baik. Suka membantu orang lain.',
                medium: 'Dapat bekerja sama dengan baik namun juga mampu menegaskan pendapat sendiri bila diperlukan.',
                low: 'Kompetitif, skeptis, dan analitis. Tidak mudah terpengaruh dan cenderung mempertanyakan motif orang lain.'
            },
            'Neuroticism': {
                high: 'Sensitif terhadap stres dan cenderung khawatir. Mungkin memerlukan dukungan tambahan dalam situasi menekan.',
                medium: 'Memiliki keseimbangan emosional yang wajar. Dapat mengelola stres dengan cukup baik.',
                low: 'Tenang, stabil secara emosional, dan tahan terhadap stres. Jarang menunjukkan reaksi emosional yang berlebihan.'
            }
        }
    },

    // RIASEC Interest Profile
    'INT-01': {
        name: 'Profil Minat RIASEC',
        description: 'Minat dan kecocokan peran kerja berdasarkan teori Holland',
        dimensions: {
            'Realistic': {
                high: 'Cocok untuk pekerjaan praktis dengan alat, mesin, atau kegiatan outdoor. Suka aktivitas hands-on dan hasil nyata.',
                medium: 'Dapat menangani tugas praktis namun tidak harus menjadi fokus utama pekerjaan.',
                low: 'Kurang tertarik pada pekerjaan fisik atau teknis. Lebih menyukai pekerjaan yang berbasis ide.'
            },
            'Investigative': {
                high: 'Cocok untuk pekerjaan riset, analisis, dan pemecahan masalah kompleks. Suka belajar dan menggali informasi.',
                medium: 'Dapat melakukan analisis bila diperlukan namun tidak harus menjadi tugas utama.',
                low: 'Kurang tertarik pada pekerjaan yang terlalu analitis atau teoretis.'
            },
            'Artistic': {
                high: 'Cocok untuk pekerjaan kreatif, desain, dan ekspresi diri. Suka kebebasan dan orisinalitas.',
                medium: 'Menghargai kreativitas namun juga bisa bekerja dalam struktur yang ditetapkan.',
                low: 'Lebih nyaman dengan pekerjaan terstruktur dan prosedur yang jelas.'
            },
            'Social': {
                high: 'Cocok untuk pekerjaan yang melibatkan membantu, mengajar, atau melayani orang lain. Empatik dan komunikatif.',
                medium: 'Dapat berinteraksi dengan orang lain dengan baik namun tidak harus menjadi fokus utama.',
                low: 'Lebih suka bekerja dengan data atau hal-hal daripada dengan orang.'
            },
            'Enterprising': {
                high: 'Cocok untuk pekerjaan kepemimpinan, penjualan, dan pengembangan bisnis. Persuasif dan ambisius.',
                medium: 'Dapat mengambil inisiatif kepemimpinan bila diperlukan.',
                low: 'Lebih nyaman sebagai kontributor individual daripada pemimpin.'
            },
            'Conventional': {
                high: 'Cocok untuk pekerjaan administratif, akuntansi, dan pengolahan data. Teliti dan terorganisir.',
                medium: 'Dapat menangani tugas administratif dengan baik sebagai bagian dari peran.',
                low: 'Kurang tertarik pada pekerjaan rutin dan administratif.'
            }
        }
    },

    // Cognitive/Reasoning Test
    'COG-01': {
        name: 'Kemampuan Kognitif',
        description: 'Kemampuan penalaran dan pemecahan masalah',
        dimensions: {
            'Logic': {
                high: 'Kemampuan penalaran logis yang sangat baik. Dapat menganalisis argumen dan membuat kesimpulan dengan akurat.',
                medium: 'Kemampuan penalaran logis yang memadai untuk sebagian besar situasi kerja.',
                low: 'Mungkin memerlukan waktu lebih untuk tugas-tugas yang membutuhkan penalaran kompleks.'
            },
            'Pattern': {
                high: 'Sangat baik dalam mengenali pola dan hubungan. Dapat dengan cepat mengidentifikasi tren dan anomali.',
                medium: 'Dapat mengenali pola dengan baik dalam kondisi normal.',
                low: 'Mungkin memerlukan bantuan atau waktu ekstra untuk mengenali pola kompleks.'
            },
            'Reasoning': {
                high: 'Kemampuan berpikir abstrak dan konseptual yang tinggi. Dapat menangani masalah kompleks dengan baik.',
                medium: 'Kemampuan penalaran yang solid untuk tugas-tugas standar.',
                low: 'Lebih nyaman dengan tugas konkret dan terstruktur.'
            }
        }
    },

    // Attention to Detail Test
    'ATT-01': {
        name: 'Ketelitian & Konsistensi',
        description: 'Kemampuan bekerja dengan akurat dan konsisten',
        dimensions: {
            'Accuracy': {
                high: 'Sangat teliti dan akurat. Jarang membuat kesalahan dan memperhatikan detail kecil.',
                medium: 'Tingkat akurasi yang memadai untuk pekerjaan standar.',
                low: 'Mungkin memerlukan double-check untuk pekerjaan yang membutuhkan presisi tinggi.'
            },
            'Speed': {
                high: 'Dapat bekerja dengan cepat tanpa mengorbankan kualitas.',
                medium: 'Kecepatan kerja yang seimbang dengan tingkat akurasi.',
                low: 'Lebih mengutamakan ketelitian daripada kecepatan.'
            },
            'Consistency': {
                high: 'Sangat konsisten dalam kinerja. Dapat diandalkan untuk hasil yang stabil.',
                medium: 'Konsistensi yang memadai dengan variasi normal.',
                low: 'Kinerja mungkin bervariasi tergantung kondisi.'
            }
        }
    },

    // Work Attitude/Integrity Test
    'WAI-01': {
        name: 'Sikap & Integritas Kerja',
        description: 'Sikap profesional dan tanggung jawab kerja',
        dimensions: {
            'Integrity': {
                high: 'Menunjukkan integritas tinggi dan kejujuran. Dapat dipercaya dalam situasi sensitif.',
                medium: 'Menunjukkan standar etika yang baik dalam kondisi normal.',
                low: 'Perlu eksplorasi lebih lanjut tentang nilai-nilai dan standar etika.'
            },
            'Responsibility': {
                high: 'Sangat bertanggung jawab dan dapat diandalkan. Menyelesaikan tugas tanpa perlu pengawasan.',
                medium: 'Menunjukkan tanggung jawab yang memadai dengan arahan yang jelas.',
                low: 'Mungkin memerlukan supervisi dan arahan lebih untuk memastikan penyelesaian tugas.'
            }
        }
    },

    // Adversity Quotient (Resilience)
    'RES-01': {
        name: 'Ketahanan & Daya Juang',
        description: 'Kemampuan menghadapi tantangan dan kesulitan (AQ)',
        dimensions: {
            'Control': {
                high: 'Merasa memiliki kendali tinggi atas situasi. Proaktif dalam menghadapi masalah.',
                medium: 'Merasa cukup mampu mengendalikan beberapa aspek situasi.',
                low: 'Cenderung merasa situasi di luar kendali saat menghadapi kesulitan.'
            },
            'Ownership': {
                high: 'Mengambil tanggung jawab penuh atas situasi dan hasil. Tidak menyalahkan orang lain.',
                medium: 'Mengakui peran sendiri sambil mempertimbangkan faktor eksternal.',
                low: 'Cenderung melihat faktor eksternal sebagai penyebab utama masalah.'
            },
            'Reach': {
                high: 'Mampu membatasi dampak masalah. Tidak membiarkan satu kesulitan mempengaruhi area lain.',
                medium: 'Cukup mampu mengisolasi masalah dari area kehidupan lainnya.',
                low: 'Kesulitan cenderung menyebar dan mempengaruhi berbagai aspek kehidupan.'
            },
            'Endurance': {
                high: 'Melihat kesulitan sebagai sementara. Optimis tentang kemampuan mengatasi masalah.',
                medium: 'Memahami bahwa sebagian besar kesulitan akan berlalu.',
                low: 'Cenderung melihat kesulitan sebagai permanen atau berkepanjangan.'
            }
        }
    }
}

/**
 * Get interpretation for a dimension score
 */
export function getDimensionInterpretation(
    moduleCode: string,
    dimension: string,
    score: number
): string {
    const level = getScoreLevel(score)
    const moduleInt = INTERPRETATIONS[moduleCode]

    if (!moduleInt) return ''

    const dimInt = moduleInt.dimensions[dimension]
    if (!dimInt) return ''

    return dimInt[level.toLowerCase() as keyof DimensionInterpretation]
}

/**
 * Get all interpretations for a module
 */
export function getModuleInterpretations(
    moduleCode: string,
    dimensions: { name: string; score: number }[]
): { name: string; score: number; level: ScoreLevel; interpretation: string }[] {
    return dimensions.map(dim => ({
        name: dim.name,
        score: dim.score,
        level: getScoreLevel(dim.score),
        interpretation: getDimensionInterpretation(moduleCode, dim.name, dim.score)
    }))
}
