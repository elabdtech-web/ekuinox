import React from "react";

const timeline = [
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
	{
		year: "1995",
		desc: "Borem ipsum dolor sit amet, consectetur adipisicing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
	},
];

export default function StoryTimelineSection() {
	return (
		<section className="w-full py-16 px-4 bg-[#070B13]">
			<h2 className="text-center text-4xl md:text-4xl font-semibold text-white mb-12">
				Our{" "}
				<span className="text-[#6ea9ff]">
					Timeline
				</span>
			</h2>
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
				{/* Vertical divider */}
				<div
					className="hidden md:block absolute left-1/2 top-0 h-full w-1.5 rounded-full bg-[#6ea9ff]/40"
					style={{ transform: "translateX(-50%)" }}
				>
					<div className="sticky top-1/3 w-full bg-[#6ea9ff] h-80 z-50 rounded-full" />
				</div>
				{/* Left column */}
				<div className="flex flex-col gap-6 md:gap-52">
					{timeline.slice(0, 3).map((item, idx) => (
						<div key={idx} className="overflow-hidden mr:mr-0 md:mr-6 p-0.5 rounded-2xl shadow-sm">
							<div className="relative group">

								<div
									className="pointer-events-none absolute inset-0 bg-[#6ea9ff] rounded-2xl spin-gradient-border transition-transform"
								>
									<div className="w-full h-full rounded-2xl  bg-gradient-to-b from-[#6ea9ff] to-[#232b3b]" />
								</div>
								{/* Card content */}
								<div className="relative z-10 rounded-2xl bg-[#101828] py-6 px-10">
									<div className="text-4xl font-semibold text-[#6ea9ff] mb-2">{item.year}</div>
									<div className="text-lg text-white/80">{item.desc}</div>
								</div>
							</div>
						</div>
					))}
				</div>
				{/* Right column */}
				<div className="flex flex-col mt-0 md:mt-52 gap-6 md:gap-52 ">
					{timeline.slice(3).map((item, idx) => (
						<div key={idx} className="overflow-hidden p-0.5 ml-0 md:ml-6 rounded-[16px]">
							<div className="relative group">

								<div
									className="pointer-events-none absolute inset-0 bg-[#6ea9ff] rounded-[17px] spin-gradient-border transition-transform"
								>
									<div className="w-full h-full rounded-[16px]  bg-gradient-to-b from-[#6ea9ff] to-[#232b3b]" />
								</div>
								{/* Card content */}
								<div className="relative z-10 rounded-2xl bg-[#101828] py-6 px-10">
									<div className="text-4xl font-semibold text-[#6ea9ff] mb-2">{item.year}</div>
									<div className="text-lg text-white/80">{item.desc}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* Add this to your global CSS (e.g., index.css):
@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
*/