"use client";
import React from "react";
import { motion } from "framer-motion";
import { gradient } from "../components/Gradient";
import { useEffect } from "react";
import { Image } from "@nextui-org/react";

export default function Home() {
  useEffect(() => {
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <div className="min-h-[50vh] flex flex-col relative bg-[#000000]">

      <main className="flex flex-col justify-center h-[90%] static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[100] pt-[30px] pb-[320px] px-4 md:px-20 md:py-0">
        <div className="flex items-center"> {/* Contenedor flex para texto e imagen */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
            className="relative md:mb-[37px] font-extrabold text-[16vw] md:text-[96px] font-inter text-[#e8e8e8] leading-[1] tracking-[-2px] z-[100]"
          >
            Sistema Gestor de <br />
            Historias Clínicas <br />
            <span className="text-[#5a8bc6]">San Sebastián</span>
            <span className="font-in text-[#5a8bc6]">.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.95,
              ease: [0.165, 0.84, 0.44, 1],
            }}
          >
            <Image
              width={300}
              alt="NextUI hero Image"
              src="https://www.unilasallista.edu.co/wp-content/uploads/2023/12/icono-veterinario.png"
              className="ml-35" // Ajusta según sea necesario
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
