export const workouts = [
    {
      arms: [
        { name: "Push Ups", reps: 10, interval: 2000, bgImage:require('./assets/images/arms-background.webp') },
        { name: "Bicep Curls", reps: 8, interval: 3000 },
        { name: "Tricep Dips", reps: 12, interval: 2500 },
        { name: "Hammer Curls", reps: 10, interval: 3000 },
        { name: "Overhead Press", reps: 8, interval: 3000 },
        { name: "Close Grip Bench Press", reps: 12, interval: 2500 },
      ],
      chest: [
        { name: "Bench Press", reps: 15, interval: 2000, bgImage:require('./assets/images/chestworkout-bg.webp')  },
        { name: "Pull Ups", reps: 3, interval: 2000 },
        { name: "Plank", reps: 30, interval: 1000, type:'sec' },
      ],
      abs: [
        { name: "Sit ups", reps: 15, interval: 1000, image:require('./assets/images/situpicon.png'),bgImage:require('./assets/images/abs-background.png') },
        { name: "Crunches", reps: 15, interval: 1000, image:require('./assets/images/situp.png') },
        { name: "Reverse Crunches", reps: 15, interval: 1000, image:require('./assets/images/reverse-crunch-icon.png') },
      ],
      legs: [
        { name: "Squats", reps: 10, interval: 2000, bgImage:require('./assets/images/legworkout-bg.jpeg') },
        { name: "Squats", reps: 5, interval: 2000 },
        { name: "Plank", reps: 30, interval: 2000 },
      ],
    },
    10,
    3,
  ];