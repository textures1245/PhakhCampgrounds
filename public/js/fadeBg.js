const imageUrl3 = [
  "https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1409&q=80",
  "https://images.unsplash.com/photo-1517823382935-51bfcb0ec6bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1573475058307-204e27d838b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
];

const imageUrl2 = [
    "https://images.unsplash.com/photo-1571228718732-a4122dcd4fca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=705&q=80",
  ]

const imageUrl1 = [
    "https://images.unsplash.com/photo-1615244330590-d87c502799cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2696&q=80",
    "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=702&q=80",
]


$(function () {
  var i = 0;
  $("#campBg3").css("background-image", "url(" + imageUrl3[i] + ")");
  setInterval(function () {
    i++;
    if (i == imageUrl3.length) {
      i = 0;
    }
    $("#campBg3").fadeOut("slow", function () {
      $(this).css("background-image", "url(" + imageUrl3[i] + ")");
      $(this).fadeIn("slow");
    });
  }, 15000);
});

$(function () {
    let i = 0;
  $("#campBg2").css("background-image", "url(" + imageUrl2[i] + ")");
  setInterval(function () {
    i++;
    if (i == imageUrl2.length) {
      i = 0;
    }
    $("#campBg2").fadeOut("slow", function () {
      $(this).css("background-image", "url(" + imageUrl2[i] + ")");
      $(this).fadeIn("slow");
    });
  }, 10000);
});

$(function () {
    let i = 0;
  $("#campBg1").css("background-image", "url(" + imageUrl1[i] + ")");
  setInterval(function () {
    i++;
    if (i == imageUrl1.length) {
      i = 0;
    }
    $("#campBg1").fadeOut("slow", function () {
      $(this).css("background-image", "url(" + imageUrl1[i] + ")");
      $(this).fadeIn("slow");
    });
  }, 7000);
});
