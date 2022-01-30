let controller = new ScrollMagic.Controller();
let timeline = new TimelineMax();
let timeline2 = new TimelineMax();
let timeline3 = new TimelineMax();
let timeline4 = new TimelineMax();
let startTimeline = new TimelineMax();

startTimeline
 .to(".main-content",3, {y: -200}, "-=3")

let mainScene = new ScrollMagic.Scene({
    triggerElement: ".main",
    duration: "100%",
    triggerHook: 0,
})
  
  .setTween(startTimeline)
  .addTo(controller);

timeline
  .fromTo(".t-1", { opacity: 0 }, { opacity: 1, duration: 8 })
  .to(".t-1",3, {y: -30}, "-=3")
  .fromTo(".t-2", { opacity: 0 }, { opacity: 1, duration: 1.5 })
  .to(".t-2",1.5, {y: -30}, "-=3")
  .fromTo(".t-3", { opacity: 0 }, { opacity: 1, duration: 1.5 });

let scene = new ScrollMagic.Scene({
  triggerElement: "#trigger-1",
  duration: "100%",
  triggerHook: 0,
})

  .setTween(timeline)
  .addTo(controller);

timeline2
  .fromTo(".t-4", { opacity: 0.3 }, { opacity: 1, duration: 3 })
  .fromTo(".t-5", { opacity: 0 }, { opacity: 1, duration: 2 })
  .fromTo(".strong-popular", { opacity: 0 }, { opacity: 1, duration: 1 })
  .to(".strong-popular", 1, {y: -30}, "-=3")
  .fromTo(".t-6", { opacity: 0 }, { opacity: 1, duration: 1.5 })


  let scene2 = new ScrollMagic.Scene({
    triggerElement: "#trigger-2",
    duration: "100%",
    triggerHook: 0,
  })
  
    .setTween(timeline2)
    .addTo(controller);

timeline3
  .fromTo(".t-7", { opacity: 0 }, { opacity: 1, duration: 5 })
  .to(".t-7", 2, {y: 30}, "-=3")

  let scene3 = new ScrollMagic.Scene({
    triggerElement: "#trigger-3",
    duration: "100%",
    triggerHook: 0,
  })
  
    .setTween(timeline3)
    .addTo(controller);

timeline4
  .fromTo(".t-8", { opacity: 0 }, { opacity: 1, duration: 1 })
  .fromTo(".t-9", { opacity: 0 }, { opacity: 1, duration: 2 })
  .fromTo(".t-10", { opacity: 0 }, { opacity: 1, duration: 1 })
  .fromTo(".d-1", { opacity: 0 }, { opacity: 1, duration: 3 })

  let scene4 = new ScrollMagic.Scene({
    triggerElement: ".trigger-4",
    duration: "130%",
    triggerHook: 0,
  })
  
    .setTween(timeline4)
    .setPin(".trigger-4")
    .addTo(controller);
