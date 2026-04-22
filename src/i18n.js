// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      login: {
        title: "Kirish",
        subtitle: "Tizimga kirish uchun ma’lumotlarni kiriting",
        login: "Login",
        password: "Parol",
        button: "Kirish",
        loading: "Yuklanmoqda...",
        language: "Til",
        noAccount: "Akkaunt yo'qmi?",
        forgotPassword: "Parolni unutdingizmi?",

        placeholders: { phone: "Nomerni kiriting", password: "Parolni kiriting" },
        errors: {
          loginRequired: "Login kiritilmadi",
          passwordRequired: "Parol kiritilmadi",
          passwordMin: "Parol kamida {{min}} belgidan iborat bo'lishi kerak"
        },
        toasts: {
          success: "Muvaffaqiyatli",
          welcomeBoss: "Muvaffaqiyatli, hush kelibsiz!",
          roleMismatch: "Role mos kelmadi",
          systemError: "Tizim xatosi"
        }
      },

      register: {
        title: "Ro'yhatdan o'tish",
        subtitle: "Tizimga bog’lanish uchun ma’lumotlarni kiriting",

        firstName: "Ism",
        lastName: "Familiya",
        phone: "Telefon",
        district: "Tuman",
        mahalla: "Mahalla",
        password: "Parol",
        confirmPassword: "Parolni tasdiqlang",

        firstNamePlaceholder: "Ismni kiriting",
        lastNamePlaceholder: "Familiya kiriting",
        phonePlaceholder: "(+998)Telefonni kiriting",
        districtPlaceholder: "Tumanni tanlang",
        mahallaPlaceholder: "Mahallani tanlang",
        passwordPlaceholder: "Parolni kiriting",
        confirmPasswordPlaceholder: "Tasdiqni kiriting",

        createBtn: "Yaratish",
        haveAccountBtn: "Akkaunt bormi? Kirish",
        systemError: "Tizim xatosi",

        errors: {
          firstNameRequired: "Ism kiritilmadi!",
          firstNameShort: "Ism juda qisqa!",
          firstNameLong: "Ism juda uzun!",

          lastNameRequired: "Familiya kiritilmadi!",
          lastNameShort: "Familiya juda qisqa!",
          lastNameLong: "Familiya juda uzun!",

          phoneRequired: "Tel kiritilmadi!",
          phoneStart: "Raqam (+998) blan boshlanishi kerak!",
          phoneLength: "Raqam xato kiritilgan!",

          districtRequired: "Tumanni kiriting!",
          mahallaRequired: "Mahallani kiriting!",

          passwordRequired: "Parol kiritilmadi",
          passwordMin: "Parol kamida 8 belgidan iborat bo'lishi kerak",
          passwordCase: "Parolda katta va kichik harf bo‘lishi shart",

          confirmRequired: "Tasdiq kiritilmadi!",
          confirmMatch: "Tasdiq parol bilan bir xil bo'lishi kerak"
        }
      },

      dashboard: {
        totalAppeals: "Jami murojaatlar",
        completed: "Bajarilgan",
        inProgress: "Jarayonda",
        rejected: "Rad etilgan",

        selectDistrict: "Tumanni tanlang",

        yearlyAppeals: "Yillik murojaatlar",
        todayMonthlyDailyActivity: "Bugungi oylik kunlik aktivlik",
        monthlyAndTodayActivity: "Oylik va bugungi aktivlik",
        statusDistribution: "Holat taqsimoti",

        legendMonthlyActivity: "Oylik aktivlik",
        legendToday: "Bugungi kun",

        status_completed: "Bajarilgan",
        status_inProgress: "Jarayonda",
        status_rejected: "Rad etilgan",

        regionsCompare: "Hududlar taqqoslamasi",
        topEmployees: "Eng faol hodimlar (Top 5)",

        table: {
          rank: "#",
          employee: "Hodim",
          region: "Hudud",
          done: "Bajarildi"
        },

        region: {
          tashkent: "Toshkent",
          samarkand: "Samarqand",
          fergana: "Farg‘ona",
          andijan: "Andijon",
          bukhara: "Buxoro"
        },

        months: {
          jan: "Yan",
          feb: "Fev",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Iyun",
          jul: "Iyul",
          aug: "Avg",
          sep: "Sen",
          oct: "Okt",
          nov: "Noy",
          dec: "Dek"
        },

        weeklyHeatmap: "Haftalik faollik xaritasi",
        weeklyHeatmapSub: "Kunlar bo‘yicha murojaatlar soni",
        heatmap: {
          week1: "1-hafta",
          week2: "2-hafta",
          week3: "3-hafta",
          week4: "4-hafta",
          mon: "Du",
          tue: "Se",
          wed: "Ch",
          thu: "Pa",
          fri: "Ju",
          sat: "Sh",
          sun: "Ya",
          low: "Kam",
          high: "Ko'p",
          countSuffix: "ta"
        }
      },

      nav: {
        dashboard: "Boshqaruv paneli",
        appeals: "Murojaatlar",
        employees: "Hodimlar",
        jekEmployees: "JEK hodimlari",
        role: "Rol",
        account:'Akaunt'
      },

      common: {
        theme: "Ko'rinish",
        logout: "Chiqish",
        search: "Qidirish",
        cancel: "Bekor qilish",
        createdAt: "Yaratilgan",
        updatedAt: "O'zgartirilgan",
        confirm: "Tasdiqlash",
        yesStart: "Ha, Boshlash",
        startWork: "Ishni Boshlash",
        finish: "Tugatish",
        reject: "Rad etish",
        view: "Ko'rish",
        minimal: "minimal",
        close: "Yopish",
        card: "Kartochka",
        table: "Jadval",
        status: "Status",
        actions: "Amallar",
        loading: "Yuklanmoqda...",
        role: "Rol",

        all: "Hammasi",
        day: "kun",
        notFound: "Topilmadi",

        // agar biror joyda common.languages ishlatilsa ham ishlaydi
        languages: {
          uz: "O'zbekcha",
          en: "English",
          ru: "Русский"
        }
      },

      appeals: {
        searchPlaceholder: "Ariza ID, ism yoki telefon...",
        startDate: "Boshlanish sana",
        endDate: "Tugash sana",

        statusAll: "Barchasi",
        status_pending: "Kutilmoqda",
        status_in_progress: "Jarayonda",
        status_completed: "Bajarildi",
        status_rejected: "Rad etildi",
        status_completed_user: "Bajarildi(Foyd.)",
        status_rejected_user: "Rad etildi(Foyd.)",

        pendingAsk: "Siz ushbu murojaatni o'z zimmangizga olasizmi?",
        finishTitle: "Ishni tugatish",
        rejectTitle: "Rad etish",

        uploadDrop: "Rasmni shu yerga tashlang yoki bosing",
        uploadTypes: "JPG, PNG, HEIC qo‘llab-quvvatlanadi",
        imageUploaded: "Rasm yuklandi",

        commentLabel: "Izoh",
        commentPlaceholder: "Bajarilgan ish haqida yozing (kamida 20 belgi)...",

        rejectReasonLabel: "Rad etish sababi",
        rejectReasonPlaceholder: "Rad etish sababini batafsil yozing...",

        applicant: "Murojaatchi",
        buildingNumber: "Bino raqami",
        apartmentNumber: "Honadon raqami",
        waitingUser: "Foydalanuvchi tomonidan tasdiqlanishi kutilmoqda",
        review: "Qayta ko'rib chiqish",
        noPhoto: "Rasm mavjud emas",
        userLetter: "Murojaat xati (Foyd.)",
        jekNote: "Izoh (JEK)",

        notFound: "Ariza mavjud emas",
        view: {
          status: "Holat",
          type: "Murojaat xati",
          startedAt: "Boshlangan sana",
          endedAt: "Tugagan sana",
          note: "Tavsif"
        },

        clearFilters: "Filterlarni tozalash",
        employee: "Hodim",
        duration: "Davomiyligi",
        area: "Hudud",
        notFinished: "Tugamagan",
        noNote: "Izoh yo'q",
        photo: "Rasm",
        table: {
          applicant: "Arizachi",
          createdAt: "Yaratilgan sana"
        }
      },

      jekEmployees: {
        toggle: "Aktiv / Nofaol",
        addAddress: "Manzil kiritish",
        addAddressTitle: "Hodimga mahalla qo'shish",
        title: "JEK hodimlar",
        searchPlaceholder: "Ism, familiya yoki telefon...",
        areaPlaceholder: "Hudud (barchasi)",

        totalEmployees: "Jami hodimlar",
        totalActiveEmployees: "Jami faol hodimlar",
        totalInactiveEmployees: "Jami faol emas hodimlar",

        statusAll: "Barchasi",
        statusActive: "Aktiv",
        statusInactive: "Nofaol",

        phone: "Telefon",
        areaCol: "Hudud",
        stats: "Statistika",
        completed: "Bajarilgan",
        avgTime: "O'rtacha vaqt",
        rating: "Reyting",

        details: "Tafsilot",
        toggle: "Aktiv/Nofaol",
        last10: "Oxirgi 10 ta murojaat",

        confirmDeactivateTitle: "Hodimni nofaol qilish",
        confirmDeactivateText:
          "Hodimni nofaol qilishni tasdiqlaysizmi? Hodim tizimga kira olmaydi.",
        confirmActivateTitle: "Hodimni aktiv qilish",
        confirmActivateText:
          "Hodimni aktiv qilishni tasdiqlaysizmi? Hodim tizimga kira oladi.",

        employee: "Hodim",
        noData: "Ma'lumot yo'q",
        notFound: "Hodim topilmadi",
        addressSingle: "Tegishli manzil",
        addressPlural: "Tegishli manzillar",
        noAddress: "Manzil mavjud emas",
        editProfile: "Ma'lumot o'zgartirish",
        changePassword: "Parol o'zgartirish",
        editProfileTitle: "Hodim ma'lumotlarini o'zgartirish",
        changePasswordTitle: "Hodim parolini o'zgartirish",
        newPassword: "Yangi parol...",
        confirmNewPassword: "Yangi parolni tasdiqlang...",

      },

      // ✅ root languages (Login menu uchun)
      languages: {
        uz: "O'zbekcha",
        en: "English",
        ru: "Русский",
        short: { uz: "O'z", en: "En", ru: "Ru" }
      }
    }
  },

  en: {
    translation: {
      login: {
        title: "Login",
        subtitle: "Enter your credentials",
        login: "Phone number",
        password: "Password",
        button: "Sign in",
        loading: "Loading...",
        language: "Language",
        noAccount: "Don't have an account?",
        forgotPassword: "Forgot password?",

        placeholders: { phone: "Enter phone number", password: "Enter password" },
        errors: {
          loginRequired: "Phone number is required",
          passwordRequired: "Password is required",
          passwordMin: "Password must be at least {{min}} characters"
        },
        toasts: {
          success: "Successfully",
          welcomeBoss: "Successfully, welcome!",
          roleMismatch: "Role did not match",
          systemError: "System error"
        }
      },

      register: {
        title: "Registeration",
        subtitle: "Enter the information to access the system",

        firstName: "First name",
        lastName: "Last name",
        phone: "Phone",
        district: "District",
        mahalla: "Neighborhood",
        password: "Password",
        confirmPassword: "Confirm password",

        firstNamePlaceholder: "Enter first name",
        lastNamePlaceholder: "Enter last name",
        phonePlaceholder: "Enter phone number",
        districtPlaceholder: "Select a district",
        mahallaPlaceholder: "Select a neighborhood",
        passwordPlaceholder: "Enter password",
        confirmPasswordPlaceholder: "Enter confirmation",

        createBtn: "Create",
        haveAccountBtn: "Already have an account? Sign in",
        systemError: "System error",

        errors: {
          firstNameRequired: "First name is required",
          firstNameShort: "First name is too short",
          firstNameLong: "First name is too long",

          lastNameRequired: "Last name is required",
          lastNameShort: "Last name is too short",
          lastNameLong: "Last name is too long",

          phoneRequired: "Phone number is required",
          phoneStart: "Phone number must start with +998",
          phoneLength: "Invalid phone number length",

          districtRequired: "District is required",
          mahallaRequired: "Neighborhood is required",

          passwordRequired: "Password is required",
          passwordMin: "Password must be at least 8 characters",
          passwordCase: "Password must include uppercase and lowercase letters",

          confirmRequired: "Confirmation is required",
          confirmMatch: "Confirmation must match the password"
        }
      },

      dashboard: {
        totalAppeals: "Total appeals",
        completed: "Completed",
        inProgress: "In progress",
        rejected: "Rejected",

        selectDistrict: "Select a district",

        yearlyAppeals: "Yearly appeals",
        todayMonthlyDailyActivity: "Today's monthly/daily activity",
        monthlyAndTodayActivity: "Monthly and today's activity",
        statusDistribution: "Status distribution",

        legendMonthlyActivity: "Monthly activity",
        legendToday: "Today",

        status_completed: "Completed",
        status_inProgress: "In progress",
        status_rejected: "Rejected",

        regionsCompare: "Regions comparison",
        topEmployees: "Most active employees (Top 5)",

        table: {
          rank: "#",
          employee: "Employee",
          region: "Region",
          done: "Done"
        },

        region: {
          tashkent: "Tashkent",
          samarkand: "Samarkand",
          fergana: "Fergana",
          andijan: "Andijan",
          bukhara: "Bukhara"
        },

        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        },

        weeklyHeatmap: "Weekly activity heatmap",
        weeklyHeatmapSub: "Number of requests by day",
        heatmap: {
          week1: "Week 1",
          week2: "Week 2",
          week3: "Week 3",
          week4: "Week 4",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun",
          low: "Low",
          high: "High",
          countSuffix: "items",
          account: "Account",
        }
      },

      nav: {
        dashboard: "Dashboard",
        appeals: "Appeals",
        employees: "Employees",
        jekEmployees: "JEK employees",
        account:'Account'
      },

      common: {
        createdAt: "Created",
        updatedAt: "Updated",
        role: "Role",
        card: "Card",
        table: "Table",
        theme: "Theme",
        logout: "Logout",
        search: "Search",
        cancel: "Cancel",
        confirm: "Confirm",
        yesStart: "Yes, start",
        startWork: "Start work",
        finish: "Finish",
        reject: "Reject",
        view: "View",
        minimal: "minimum",
        close: "Close",
        status: "Status",
        actions: "Actions",
        loading: "Loading...",

        all: "All",
        day: "day(s)",
        notFound: "Not found",

        languages: {
          uz: "Uzbek",
          en: "English",
          ru: "Russian"
        }
      },

      appeals: {
        searchPlaceholder: "ID, name or phone...",
        startDate: "Start date",
        endDate: "End date",

        statusAll: "All",
        status_pending: "Pending",
        status_in_progress: "In progress",
        status_completed: "Completed",
        status_rejected: "Rejected",
        status_completed_user: "Completed (User)",
        status_rejected_user: "Rejected (User)",

        pendingAsk: "Do you take this appeal under your responsibility?",
        finishTitle: "Finish work",
        rejectTitle: "Reject",

        uploadDrop: "Drop an image here or click",
        uploadTypes: "JPG, PNG, HEIC are supported",
        imageUploaded: "Image uploaded",

        commentLabel: "Comment",
        commentPlaceholder: "Describe the completed work (at least 20 characters)...",

        rejectReasonLabel: "Reject reason",
        rejectReasonPlaceholder: "Describe the reason for rejection...",

        notFound: "No requests found",
        applicant: "Applicant",
        buildingNumber: "Building number",
        apartmentNumber: "Apartment number",
        waitingUser: "Waiting for user confirmation",
        review: "Review again",
        noPhoto: "No photo available",
        userLetter: "User request letter",
        jekNote: "JEK note",
        view: {
          status: "Status",
          type: "Request type",
          startedAt: "Start date",
          endedAt: "End date",
          note: "Description"
        },

        clearFilters: "Clear filters",
        employee: "Employee",
        duration: "Duration",
        area: "Area",
        notFinished: "Not finished",
        noNote: "No note",
        photo: "Photo",
        table: {
          applicant: "Applicant",
          createdAt: "Created at"
        }
      },

      jekEmployees: {
        createdAt: "Created",
        updatedAt: "Updated",
        addressSingle: "Assigned address",
        addressPlural: "Assigned addresses",
        noAddress: "No address available",
        editProfile: "Edit information",
        changePassword: "Change password",
        editProfileTitle: "Edit employee information",
        changePasswordTitle: "Change employee password",
        newPassword: "New password...",
        confirmNewPassword: "Confirm new password...",
        title: "JEK employees",
        searchPlaceholder: "Name, surname or phone...",
        areaPlaceholder: "Area (all)",

        totalEmployees: "Total employees",
        totalActiveEmployees: "Total active employees",
        totalInactiveEmployees: "Total inactive employees",

        statusAll: "All",
        statusActive: "Active",
        statusInactive: "Inactive",

        phone: "Phone",
        areaCol: "Area",
        stats: "Statistics",
        completed: "Completed",
        avgTime: "Avg time",
        rating: "Rating",

        details: "Details",
        toggle: "Active/Inactive",
        last10: "Last 10 appeals",

        confirmDeactivateTitle: "Deactivate employee",
        confirmDeactivateText:
          "Confirm deactivating the employee? The employee won’t be able to log in.",
        confirmActivateTitle: "Activate employee",
        confirmActivateText:
          "Confirm activating the employee? The employee will be able to log in.",

        employee: "Employee",
        noData: "No data",
        notFound: "Employee not found"
      },

      languages: {
        uz: "Uzbek",
        en: "English",
        ru: "Russian",
        short: { uz: "UZ", en: "EN", ru: "RU" }
      }
    }
  },

  ru: {
    translation: {
      login: {
        title: "Вход",
        subtitle: "Введите данные",
        login: "Номер телефона",
        password: "Пароль",
        button: "Войти",
        loading: "Загрузка...",
        language: "Язык",
        noAccount: "Нет аккаунта?",
        forgotPassword: "Забыли пароль?",

        placeholders: { phone: "Введите номер телефона", password: "Введите пароль" },
        errors: {
          loginRequired: "Номер телефона не введён",
          passwordRequired: "Пароль не введён",
          passwordMin: "Пароль должен быть не менее {{min}} символов"
        },
        toasts: {
          success: "Успешно",
          welcomeBoss: "Успешно, добро пожаловать!",
          roleMismatch: "Роль не совпала",
          systemError: "Системная ошибка"
        }
      },

      register: {
        title: "Регистрация",
        subtitle: "Введите данные для доступа к системе",

        firstName: "Имя",
        lastName: "Фамилия",
        phone: "Телефон",
        district: "Район",
        mahalla: "Махалля",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",

        firstNamePlaceholder: "Введите имя",
        lastNamePlaceholder: "Введите фамилию",
        phonePlaceholder: "Введите номер телефона",
        districtPlaceholder: "Выберите район",
        mahallaPlaceholder: "Выберите махаллю",
        passwordPlaceholder: "Введите пароль",
        confirmPasswordPlaceholder: "Введите подтверждение",

        createBtn: "Создать",
        haveAccountBtn: "Есть аккаунт? Войти",
        systemError: "Системная ошибка",

        errors: {
          firstNameRequired: "Имя не введено",
          firstNameShort: "Имя слишком короткое",
          firstNameLong: "Имя слишком длинное",

          lastNameRequired: "Фамилия не введена",
          lastNameShort: "Фамилия слишком короткая",
          lastNameLong: "Фамилия слишком длинная",

          phoneRequired: "Номер телефона не введён",
          phoneStart: "Номер должен начинаться с +998",
          phoneLength: "Неверная длина номера",

          districtRequired: "Выберите район",
          mahallaRequired: "Выберите махаллю",

          passwordRequired: "Пароль не введён",
          passwordMin: "Пароль должен быть не менее 8 символов",
          passwordCase: "Пароль должен содержать большие и маленькие буквы",

          confirmRequired: "Подтверждение не введено",
          confirmMatch: "Подтверждение должно совпадать с паролем"
        }
      },

      dashboard: {
        totalAppeals: "Всего обращений",
        completed: "Выполнено",
        inProgress: "В процессе",
        rejected: "Отклонено",

        selectDistrict: "Выберите район",

        yearlyAppeals: "Годовые обращения",
        todayMonthlyDailyActivity: "Активность за сегодня/месяц/день",
        monthlyAndTodayActivity: "Месячная и сегодняшняя активность",
        statusDistribution: "Распределение статусов",

        legendMonthlyActivity: "Месячная активность",
        legendToday: "Сегодня",

        status_completed: "Выполнено",
        status_inProgress: "В процессе",
        status_rejected: "Отклонено",

        regionsCompare: "Сравнение по регионам",
        topEmployees: "Самые активные сотрудники (Топ 5)",

        table: {
          rank: "№",
          employee: "Сотрудник",
          region: "Регион",
          done: "Выполнено"
        },

        region: {
          tashkent: "Ташкент",
          samarkand: "Самарканд",
          fergana: "Фергана",
          andijan: "Андижан",
          bukhara: "Бухара"
        },

        months: {
          jan: "Янв",
          feb: "Фев",
          mar: "Мар",
          apr: "Апр",
          may: "Май",
          jun: "Июн",
          jul: "Июл",
          aug: "Авг",
          sep: "Сен",
          oct: "Окт",
          nov: "Ноя",
          dec: "Дек"
        },

        weeklyHeatmap: "Тепловая карта недели",
        weeklyHeatmapSub: "Количество заявок по дням",
        heatmap: {
          week1: "Неделя 1",
          week2: "Неделя 2",
          week3: "Неделя 3",
          week4: "Неделя 4",
          mon: "Пн",
          tue: "Вт",
          wed: "Ср",
          thu: "Чт",
          fri: "Пт",
          sat: "Сб",
          sun: "Вс",
          low: "Мало",
          high: "Много",
          countSuffix: "шт."
        }
      },

      nav: {
        dashboard: "Панель",
        appeals: "Обращения",
        employees: "Сотрудники",
        jekEmployees: "Сотрудники ЖЭК",
        account: "Аккаунт",
      },

      common: {
        createdAt: "Создано",
        updatedAt: "Обновлено",
        role: "Роль",
        card: "Карточка",
        table: "Таблица",
        theme: "Тема",
        logout: "Выход",
        search: "Поиск",
        cancel: "Отмена",
        confirm: "Подтвердить",
        yesStart: "Да, начать",
        startWork: "Начать",
        finish: "Завершить",
        reject: "Отклонить",
        view: "Просмотр",
        minimal: "минимум",
        close: "Закрыть",
        status: "Статус",
        actions: "Действия",
        loading: "Загрузка...",

        all: "Все",
        day: "дн.",
        notFound: "Не найдено",

        languages: {
          uz: "Узбекский",
          en: "Английский",
          ru: "Русский"
        }
      },

      appeals: {
        searchPlaceholder: "Заявление ID, имя или телефон...",
        startDate: "Дата начала",
        endDate: "Дата окончания",

        statusAll: "Все",
        status_pending: "Ожидает",
        status_in_progress: "В процессе",
        status_completed: "Выполнено",
        status_rejected: "Отклонено",
        status_completed_user: "Завершено (Польз.)",
        status_rejected_user: "Отклонено (Польз.)",

        pendingAsk: "Вы берёте это обращение на себя?",
        finishTitle: "Завершение работы",
        rejectTitle: "Отклонение",

        uploadDrop: "Перетащите изображение сюда или нажмите",
        uploadTypes: "Поддерживаются JPG, PNG, HEIC",
        imageUploaded: "Изображение загружено",

        commentLabel: "Комментарий",
        commentPlaceholder: "Опишите выполненную работу (минимум 20 символов)...",

        rejectReasonLabel: "Причина отклонения",
        rejectReasonPlaceholder: "Подробно опишите причину отклонения...",

        notFound: "Заявок не найдено",
        view: {
          status: "Статус",
          type: "Тип обращения",
          startedAt: "Дата начала",
          endedAt: "Дата окончания",
          note: "Описание"
        },

        clearFilters: "Очистить фильтры",
        employee: "Сотрудник",
        duration: "Длительность",
        area: "Район",
        notFinished: "Не завершено",
        noNote: "Нет комментария",
        photo: "Фото",

        table: {
          applicant: "Заявитель",
          createdAt: "Дата создания"
        },
        applicant: "Заявитель",
        buildingNumber: "Номер здания",
        apartmentNumber: "Номер квартиры",
        waitingUser: "Ожидается подтверждение пользователя",
        review: "Пересмотреть",
        noPhoto: "Фото отсутствует",
        userLetter: "Обращение (Польз.)",
        jekNote: "Комментарий (ЖЭК)",
      },

      jekEmployees: {
        addressSingle: "Закреплённый адрес",
        addressPlural: "Закреплённые адреса",
        noAddress: "Адрес отсутствует",
        editProfile: "Редактировать данные",
        changePassword: "Изменить пароль",
        editProfileTitle: "Редактирование данных сотрудника",
        changePasswordTitle: "Изменение пароля сотрудника",
        newPassword: "Новый пароль...",
        confirmNewPassword: "Подтвердите новый пароль...",
        title: "Сотрудники ЖЭК",
        searchPlaceholder: "Имя, фамилия или телефон...",
        areaPlaceholder: "Район (все)",

        totalEmployees: "Всего сотрудников",
        totalActiveEmployees: "Всего активных сотрудников",
        totalInactiveEmployees: "Всего неактивных сотрудников",

        statusAll: "Все",
        statusActive: "Активный",
        statusInactive: "Неактивный",

        phone: "Телефон",
        areaCol: "Район",
        stats: "Статистика",
        completed: "Выполнено",
        avgTime: "Среднее время",
        rating: "Рейтинг",

        details: "Подробнее",
        toggle: "Актив/Неактив",
        last10: "Последние 10 обращений",
        toggle: "Активный / Неактивный",
        addAddress: "Добавить адрес",
        addAddressTitle: "Добавить махаллю сотруднику",

        confirmDeactivateTitle: "Сделать сотрудника неактивным",
        confirmDeactivateText:
          "Подтвердить? Сотрудник не сможет войти в систему.",
        confirmActivateTitle: "Сделать сотрудника активным",
        confirmActivateText:
          "Подтвердить? Сотрудник сможет войти в систему.",

        employee: "Сотрудник",
        noData: "Нет данных",
        notFound: "Сотрудник не найден"
      },

      languages: {
        uz: "Узбекский",
        en: "Английский",
        ru: "Русский",
        short: { uz: "UZ", en: "EN", ru: "RU" }
      }
    }
  }
};

const savedLng = localStorage.getItem("lng");

i18n.use(initReactI18next).init({
  resources,
  lng: savedLng || "uz",
  fallbackLng: "uz",
  supportedLngs: ["uz", "en", "ru"],
  interpolation: { escapeValue: false }
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lng", lng);
});

export default i18n;