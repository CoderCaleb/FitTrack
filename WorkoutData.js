export const workouts = [
    {
      arms: [
        { name: "Push Ups", reps: 10, interval: 2000, bgImage:require('./assets/images/arms-background.webp'), imageTop:require('./assets/images/push-up-gif.gif')},
        { name: "Bicep Curls", reps: 8, interval: 3000,imageTop:require('./assets/images/bicep-curls-gif.gif') },
        { name: "Tricep Dips", reps: 12, interval: 2500,imageTop:require('./assets/images/tricep-dips-gif.gif') },
        { name: "Hammer Curls", reps: 10, interval: 3000,imageTop:require('./assets/images/hammer-curls-gif.gif') },
        { name: "Overhead Press", reps: 8, interval: 3000,imageTop:require('./assets/images/overhead-press-gif.gif') },
        { name: "Close Grip Bench Press", reps: 12, interval: 2500,imageTop:require('./assets/images/close-grip-bench-press-gif.gif') },
      ],
      chest: [
        { name: "Bench Press", reps: 15, interval: 2000, bgImage:require('./assets/images/chestworkout-bg.webp')  },
        { name: "Pull Ups", reps: 3, interval: 2000 },
        { name: "Plank", reps: 30, interval: 1000, type:'sec' },
      ],
      abs: [
        { name: "Sit ups", reps: 15, interval: 1000, image:require('./assets/images/situpicon.png'),bgImage:require('./assets/images/abs-background.png'),imageTop:require('./assets/images/situp-img.gif') },
        { name: "Crunches", reps: 15, interval: 1000, image:require('./assets/images/situp.png'), imageTop:require('./assets/images/crunches-img.gif') },
        { name: "Reverse Crunches", reps: 15, interval: 1000, image:require('./assets/images/reverse-crunch-icon.png'),imageTop:require('./assets/images/reverse-crunch-img.gif') },
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