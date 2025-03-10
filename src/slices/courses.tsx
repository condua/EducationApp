export interface Course {
  _id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  price: string;
  rating: number;
  mentors: Mentor[];
  chapters: Chapter[];
  thumbnail: string;
  category: string;
  students: number;
}

export interface Mentor {
  _id: string;
  name: string;
  email: string;
}

export interface Chapter {
  _id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  _id: string;
  title: string;
  youtubeUrl: string;
  pdfUrl: string;
  exercisePdfUrl: string;
  content: string;
  time: number;
  locked: boolean;
}

export const sampleCourses: Course[] = [
  {
    _id: "65fa3456e1234abcd5678910",
    title: "Khóa học ReactJS từ cơ bản đến nâng cao",
    description: "Học ReactJS từ những khái niệm cơ bản đến ứng dụng thực tế.",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYFYUMxwjoJUgk-Bv9mwUGhi6uhAIKOfWZHw&s",
    mentor: {
      _id: "65fa12c7e1234abcd567890f",
      name: "Nguyễn Văn A",
      email: "mentorA@example.com",
    },
    chapters: [
      {
        _id: "65fa4567e1234abcd5678921a",
        title: "Chương 1: Giới thiệu ReactJS",
        lessons: [
          {
            _id: "65fa5678e1234abcd5678932",
            title: "Bài 1: React là gì?",
            youtubeUrl:
              "https://www.youtube.com/embed/N3AkSS5hXMA?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/react-intro.pdf",
            exercisePdfUrl: "https://example.com/react-exercise.pdf",
            content:
              "React là một thư viện JavaScript để xây dựng giao diện người dùng.",
            time: 8,
            locked: false,
          },

          {
            _id: "65fa5678e1234abcd5678933b",
            title: "Bài 2: Cài đặt môi trường React",
            youtubeUrl:
              "https://www.youtube.com/embed/Ma6DRDIedVE?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/react-setup.pdf",
            exercisePdfUrl: "https://example.com/react-setup-exercise.pdf",
            content: "Hướng dẫn cài đặt môi trường React với Create React App.",
            time: 12,
            locked: false,
          },
        ],
      },
      {
        _id: "65fa4567e1234abcd5678922c",
        title: "Chương 2: JSX & Component",
        lessons: [
          {
            _id: "65fa5678e1234abcd5678934",
            title: "Bài 3: JSX là gì?",
            youtubeUrl:
              "https://www.youtube.com/embed/N3AkSS5hXMA?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/jsx-intro.pdf",
            exercisePdfUrl: "https://example.com/jsx-exercise.pdf",
            content:
              "JSX là cú pháp mở rộng của JavaScript được dùng trong React.",
            time: 15,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd5678934s",
            title: "Bài 4: DOM là gì?",
            youtubeUrl:
              "https://www.youtube.com/embed/N3AkSS5hXMA?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/jsx-intro.pdf",
            exercisePdfUrl: "https://example.com/jsx-exercise.pdf",
            content:
              "JSX là cú pháp mở rộng của JavaScript được dùng trong React.",
            time: 15,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd5678934e",
            title: "Bài 5: DOM là gì?",
            youtubeUrl:
              "https://www.youtube.com/embed/N3AkSS5hXMA?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/jsx-intro.pdf",
            exercisePdfUrl: "https://example.com/jsx-exercise.pdf",
            content:
              "JSX là cú pháp mở rộng của JavaScript được dùng trong React.",
            time: 15,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd5678934r",
            title: "Bài 6: DOM là gì?",
            youtubeUrl:
              "https://www.youtube.com/embed/N3AkSS5hXMA?si=oDUb6RnLnD3phcWw",
            pdfUrl: "https://example.com/jsx-intro.pdf",
            exercisePdfUrl: "https://example.com/jsx-exercise.pdf",
            content:
              "JSX là cú pháp mở rộng của JavaScript được dùng trong React.",
            time: 15,
            locked: false,
          },
        ],
      },
    ],
    category: "Web Development",
    price: "Free",
    rating: 4.9,
    students: 14580,
  },
  {
    _id: "65fa3456e1234abcd56789112312",
    title: "Lập trình Node.js từ A-Z",
    description: "Khóa học giúp bạn xây dựng backend với Node.js và Express.",
    thumbnail:
      "https://e7.pngegg.com/pngimages/205/650/png-clipart-node-js-javascript-software-developer-express-js-computer-software-node-js-logo-nodejs-thumbnail.png",
    mentor: {
      _id: "65fa12c7e1234abcd567891120",
      name: "Trần Văn B",
      email: "mentorB@example.com",
    },
    chapters: [
      {
        _id: "65fa4567e1234abcd5643128921",
        title: "Chương 1: Giới thiệu ReactJS",
        lessons: [
          {
            _id: "65fa5678e1234abcd5123678932",
            title: "Bài 1: React là gì?",
            youtubeUrl: "https://www.youtube.com/watch?v=abcdefghij",
            pdfUrl: "https://example.com/react-intro.pdf",
            exercisePdfUrl: "https://example.com/react-exercise.pdf",
            content:
              "React là một thư viện JavaScript để xây dựng giao diện người dùng.",
            time: 10,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd567891231233",
            title: "Bài 2: Cài đặt môi trường React",
            youtubeUrl: "https://www.youtube.com/watch?v=klmnopqrst",
            pdfUrl: "https://example.com/react-setup.pdf",
            exercisePdfUrl: "https://example.com/react-setup-exercise.pdf",
            content: "Hướng dẫn cài đặt môi trường React với Create React App.",
            time: 8,
            locked: false,
          },
        ],
      },
      {
        _id: "65fa4567e1234abcd56789243242",
        title: "Chương 2: JSX & Component",
        lessons: [
          {
            _id: "65fa5678e1234abcd5314314678934",
            title: "Bài 3: JSX là gì?",
            youtubeUrl: "https://www.youtube.com/watch?v=uvwxyzzz",
            pdfUrl: "https://example.com/jsx-intro.pdf",
            exercisePdfUrl: "https://example.com/jsx-exercise.pdf",
            content:
              "JSX là cú pháp mở rộng của JavaScript được dùng trong React.",
            time: 8,
            locked: false,
          },
        ],
      },
    ],
    category: "Programming",
    price: "Free",
    rating: 4.2,
    students: 990,
  },
  {
    _id: "65fa3456e1234abcd5678999",
    title: "Khóa học Tiếng Anh Giao Tiếp",
    description:
      "Khóa học giúp bạn cải thiện kỹ năng giao tiếp tiếng Anh một cách tự nhiên và hiệu quả.",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08FBAKZACqf4EfcnFo4_lIXIJy1d_sad7YA&s",
    mentor: {
      _id: "65fa12c7e1234abcd5678988",
      name: "John Smith",
      email: "john.smith@example.com",
    },
    chapters: [
      {
        _id: "65fa4567e1234abcd5678977",
        title: "Chương 1: Phát Âm và Ngữ Điệu",
        lessons: [
          {
            _id: "65fa5678e1234abcd5678966",
            title: "Bài 1: Nguyên âm và Phụ âm",
            youtubeUrl:
              "https://www.youtube.com/embed/1KxibErWl-g?si=jJOqslZr8DgcvA9q",
            pdfUrl: "https://example.com/phonetics.pdf",
            exercisePdfUrl: "https://example.com/phonetics-exercise.pdf",
            content:
              "Giới thiệu cách phát âm đúng nguyên âm và phụ âm trong tiếng Anh.",
            time: 12,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd5678955",
            title: "Bài 2: Ngữ điệu và trọng âm",
            youtubeUrl: "https://www.youtube.com/embed/-Uo1qYERol4",
            pdfUrl: "https://example.com/intonation.pdf",
            exercisePdfUrl: "https://example.com/intonation-exercise.pdf",
            content: "Học cách sử dụng ngữ điệu để giao tiếp tự nhiên hơn.",
            time: 15,
            locked: false,
          },
        ],
      },
      {
        _id: "65fa4567e1234abcd5678944",
        title: "Chương 2: Giao Tiếp Hàng Ngày",
        lessons: [
          {
            _id: "65fa5678e1234abcd5678933",
            title: "Bài 3: Giới thiệu bản thân",
            youtubeUrl: "https://www.youtube.com/embed/example3",
            pdfUrl: "https://example.com/self-introduction.pdf",
            exercisePdfUrl:
              "https://example.com/self-introduction-exercise.pdf",
            content:
              "Học cách giới thiệu bản thân bằng tiếng Anh một cách tự tin.",
            time: 10,
            locked: false,
          },
          {
            _id: "65fa5678e1234abcd5678922",
            title: "Bài 4: Hỏi đường và chỉ đường",
            youtubeUrl: "https://www.youtube.com/embed/example4",
            pdfUrl: "https://example.com/directions.pdf",
            exercisePdfUrl: "https://example.com/directions-exercise.pdf",
            content:
              "Hướng dẫn cách hỏi và chỉ đường trong giao tiếp hàng ngày.",
            time: 12,
            locked: false,
          },
        ],
      },
    ],
    category: "Language Learning",
    price: "Free",
    rating: 4.8,
    students: 3200,
  },
  {
    _id: "course_001",
    title: "Ngữ Pháp Tiếng Anh Toàn Diện",
    description:
      "Khóa học giúp bạn nắm vững toàn bộ ngữ pháp tiếng Anh từ cơ bản đến nâng cao.",
    level: "Beginner",
    duration: "12 tuần",
    price: "Free",
    rating: 4.8,
    mentors: [
      {
        _id: "mentor_001",
        name: "Nguyễn Minh Anh",
        email: "minhanh@example.com",
      },
      { _id: "mentor_002", name: "Trần Văn Bảo", email: "vanbao@example.com" },
    ],
    thumbnail: "https://example.com/course-thumbnail.jpg",
    category: "Ngữ pháp",
    students: 1200,
    chapters: [
      {
        _id: "chapter_001",
        title: "Chương 1: Thì trong tiếng Anh",
        lessons: [
          {
            _id: "lesson_001",
            title: "Thì Hiện Tại Đơn (Present Simple)",
            youtubeUrl: "https://youtube.com/embed/q8jpjL0GPhk",
            pdfUrl: "https://example.com/present-simple.pdf",
            exercisePdfUrl: "https://example.com/present-simple-exercises.pdf",
            content:
              "Tìm hiểu cách sử dụng thì hiện tại đơn trong các tình huống thực tế.",
            time: 15,
            locked: false,
          },
          {
            _id: "lesson_002",
            title: "Thì Hiện Tại Tiếp Diễn (Present Continuous)",
            youtubeUrl: "https://youtube.com/embed/ZZtHS_NU-5g",
            pdfUrl: "https://example.com/present-continuous.pdf",
            exercisePdfUrl:
              "https://example.com/present-continuous-exercises.pdf",
            content:
              "Học cách sử dụng thì hiện tại tiếp diễn để diễn tả hành động đang diễn ra.",
            time: 18,
            locked: false,
          },
          {
            _id: "lesson_003",
            title: "Thì Quá Khứ Đơn (Past Simple)",
            youtubeUrl: "https://www.youtube.com/embed/lmCBxXztfEY",
            pdfUrl: "https://example.com/past-simple.pdf",
            exercisePdfUrl: "https://example.com/past-simple-exercises.pdf",
            content:
              "Nắm vững thì quá khứ đơn để kể về những sự kiện đã xảy ra.",
            time: 20,
            locked: false,
          },
          {
            _id: "lesson_004",
            title: "Thì Quá Khứ Tiếp Diễn (Past Continuous)",
            youtubeUrl: "https://youtube.com/embed/ygcboZ7Jpvs",
            pdfUrl: "https://example.com/past-continuous.pdf",
            exercisePdfUrl: "https://example.com/past-continuous-exercises.pdf",
            content:
              "Học cách dùng thì quá khứ tiếp diễn để mô tả hành động đang diễn ra trong quá khứ.",
            time: 17,
            locked: false,
          },
          {
            _id: "lesson_005",
            title: "Thì Hiện Tại Hoàn Thành (Present Perfect)",
            youtubeUrl: "https://youtube.com/embed/dQiYjKYSH0w",
            pdfUrl: "https://example.com/present-perfect.pdf",
            exercisePdfUrl: "https://example.com/present-perfect-exercises.pdf",
            content:
              "Khám phá cách sử dụng thì hiện tại hoàn thành trong nhiều tình huống.",
            time: 22,
            locked: false,
          },
          {
            _id: "lesson_006",
            title:
              "Thì Hiện Tại Hoàn Thành Tiếp Diễn (Present Perfect Continuous)",
            youtubeUrl: "https://www.youtube.com/embed/nOid1SbUo1k",
            pdfUrl: "https://example.com/present-perfect-continuous.pdf",
            exercisePdfUrl:
              "https://example.com/present-perfect-continuous-exercises.pdf",
            content:
              "Tìm hiểu cách sử dụng thì hiện tại hoàn thành tiếp diễn và sự khác biệt với các thì khác.",
            time: 19,
            locked: false,
          },
          {
            _id: "lesson_007",
            title: "Thì Quá Khứ Hoàn Thành (Past Perfect)",
            youtubeUrl: "https://youtube.com/embed/_DCeOxI6G44",
            pdfUrl: "https://example.com/past-perfect.pdf",
            exercisePdfUrl: "https://example.com/past-perfect-exercises.pdf",
            content:
              "Nắm vững thì quá khứ hoàn thành và cách sử dụng trong các tình huống cụ thể.",
            time: 21,
            locked: false,
          },
          {
            _id: "lesson_008",
            title: "Thì Quá Khứ Hoàn Thành Tiếp Diễn (Past Perfect Continuous)",
            youtubeUrl: "https://youtube.com/embed/nOid1SbUo1k",
            pdfUrl: "https://example.com/past-perfect-continuous.pdf",
            exercisePdfUrl:
              "https://example.com/past-perfect-continuous-exercises.pdf",
            content:
              "Tìm hiểu cách dùng thì quá khứ hoàn thành tiếp diễn để mô tả quá trình trong quá khứ.",
            time: 18,
            locked: false,
          },
          {
            _id: "lesson_009",
            title: "Thì Tương Lai Đơn (Future Simple)",
            youtubeUrl: "https://youtube.com/embed/ziHWgJrmIS0",
            pdfUrl: "https://example.com/future-simple.pdf",
            exercisePdfUrl: "https://example.com/future-simple-exercises.pdf",
            content:
              "Khám phá thì tương lai đơn và cách dùng để diễn tả dự đoán, kế hoạch, và ý định.",
            time: 16,
            locked: false,
          },
          {
            _id: "lesson_010",
            title: "Thì Tương Lai Tiếp Diễn (Future Continuous)",
            youtubeUrl: "https://youtube.com/embed/7d0MpOr9x0o",
            pdfUrl: "https://example.com/future-continuous.pdf",
            exercisePdfUrl:
              "https://example.com/future-continuous-exercises.pdf",
            content:
              "Học cách sử dụng thì tương lai tiếp diễn để diễn tả hành động đang diễn ra trong tương lai.",
            time: 20,
            locked: false,
          },
          {
            _id: "lesson_011",
            title: "Thì Tương Lai Hoàn Thành (Future Perfect)",
            youtubeUrl: "https://youtube.com/embed/OmjAJXeKeIg",
            pdfUrl: "https://example.com/future-perfect.pdf",
            exercisePdfUrl: "https://example.com/future-perfect-exercises.pdf",
            content:
              "Tìm hiểu cách sử dụng thì tương lai hoàn thành để diễn tả hành động hoàn tất trong tương lai.",
            time: 22,
            locked: false,
          },
          {
            _id: "lesson_012",
            title:
              "Thì Tương Lai Hoàn Thành Tiếp Diễn (Future Perfect Continuous)",
            youtubeUrl: "https://youtube.com/embed/VopXfpb3IAk",
            pdfUrl: "https://example.com/future-perfect-continuous.pdf",
            exercisePdfUrl:
              "https://example.com/future-perfect-continuous-exercises.pdf",
            content:
              "Nắm vững thì tương lai hoàn thành tiếp diễn và cách sử dụng trong các tình huống thực tế.",
            time: 23,
            locked: false,
          },
        ],
      },
    ],
  },
];
