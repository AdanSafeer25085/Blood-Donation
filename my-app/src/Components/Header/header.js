function Header() {
  return (
    <div className="bg-[#eaeaee] relative h-auto">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="./image/back1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="max-w-[1250px] text-white mx-auto flex flex-col md:flex-row items-center md:items-start relative overflow-hidden z-10">
        <div className="w-full flex flex-col items-center px-4 md:px-8 py-8 md:py-24">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
            Every drop counts! Join us in making a difference by donating blood
            today.
          </h1>
          <p className="text-sm md:text-base mt-4 text-center">
            Donating blood is an extraordinary act of kindness that can
            transform lives. Picture the relief and gratitude of a family whose
            loved one survives a critical moment because of your generosity.
            Each donation has the potential to save multiple lives, offering
            patients the precious gift of more time, more memories, and more
            life. It's a simple act with profound impacts, showcasing the
            incredible power of human compassion. By giving blood, you are not
            only sharing a part of yourself but also providing a lifeline to
            those in urgent need. Step up and become a silent hero in someone's
            life journey. Donate blood and be a beacon of hope and life for
            others.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Header;
