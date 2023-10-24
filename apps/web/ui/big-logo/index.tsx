"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

function parseGradient(gradientString: string) {
  const gradientParts = gradientString.match(/linear-gradient\(([^)]+)\)/i);
  if (!gradientParts || gradientParts.length !== 2) {
    throw new Error('Invalid gradient string format');
  }

  const parts = gradientParts[1].split(/,\s*/);
  const angle = parts.shift();
  const colors = [];
  const positions = [];

  for (let i = 0; i < parts.length; i++) {
    const colorParts = parts[i].trim().split(/\s+/);
    if (colorParts.length !== 2) {
      throw new Error('Invalid color or position format');
    }
    colors.push(colorParts[0]);
    positions.push(colorParts[1]);
  }

  if (colors.length !== 3 || positions.length !== 3) {
    throw new Error('Expected three colors and three positions');
  }

  return { angle, colors, positions };
}

export function BigLogo(props: {
  text: string;
  gradient1: string;
  gradient2: string;
}) {
  
  const { text, gradient1, gradient2 } = props;

  const initialGradient = React.useMemo(() => parseGradient(gradient1), [gradient1]);
  const finalGradient = React.useMemo(() => parseGradient(gradient2), [gradient2]);

  const gradient1Ref = useRef<SVGLinearGradientElement | null>(null);
  const gradient2Ref = useRef<SVGLinearGradientElement | null>(null);
  const stops1Ref = useRef<(SVGStopElement | null)[]>([]);
  const stops2Ref = useRef<(SVGStopElement | null)[]>([]);

  const dummy = useRef<{ rotation: number }>({ rotation: initialGradient.angle ? parseFloat(initialGradient.angle) : 0 });


  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Animate the rotation property of the dummy object
    tl.to(dummy.current, {
      rotation: finalGradient.angle ? parseFloat(finalGradient.angle) : 0,      duration: 2,
      ease: "none",
      delay: 0.001,
      // Update the gradientTransform attribute of the linearGradient elements on each tick
      onUpdate: () => {
        if (gradient1Ref.current && gradient2Ref.current) {
          const rotation = dummy.current.rotation;
          gradient1Ref.current.setAttribute('gradientTransform', `rotate(${rotation})`);
          gradient2Ref.current.setAttribute('gradientTransform', `rotate(${rotation})`);
        }
      }
    }, 0);

    // Animate the stop colors and positions for gradient1
    finalGradient.colors.forEach((color, index) => {
      tl.to(stops1Ref.current[index], {
        stopColor: color,
        offset: finalGradient.positions[index],
        duration: 2,
        ease: "none",
        delay: 0.001,
      }, 0);
    });

    // Animate the stop colors and positions for gradient2
    finalGradient.colors.forEach((color, index) => {
      tl.to(stops2Ref.current[index], {
        stopColor: color,
        offset: finalGradient.positions[index],
        duration: 2,
        ease: "none",
        delay: 0.001,
      }, 0);
    });

    return () => {
      tl.kill(); // Cleanup
    };
  }, [initialGradient, finalGradient]);

  return (
    <div className="flex flex-col gap-8 items-center mt-44">
      <small className="uppercase text-lg ">MODULAR CLOUD</small>
      <svg width="100%" height="4rem" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Initial Gradient */}
          <linearGradient
            id="gradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientTransform={`rotate(${initialGradient.angle})`}
            ref={gradient1Ref}
          >
            {initialGradient.colors.map((color, index) => (
              <stop
                key={index}
                offset={initialGradient.positions[index]}
                stopColor={color}
                ref={(el) => stops1Ref.current[index] = el}
              />
            ))}
          </linearGradient>
          {/* Final Gradient */}
          <linearGradient
            id="gradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientTransform={`rotate(${finalGradient.angle})`}
            ref={gradient2Ref}
          >
            {finalGradient.colors.map((color, index) => (
              <stop
                key={index}
                offset={finalGradient.positions[index]}
                stopColor={color}
                ref={(el) => stops2Ref.current[index] = el}
              />
            ))}
          </linearGradient>
          {/* Mask Definition */}
          <mask id="mask">
            <rect id="maskRect" x="0" y="0" width="100%" height="100%" fill="white" />
          </mask>
        </defs>
        {/* Text with Initial Gradient */}
        <text
          x="50%"
          y="50%"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="url(#gradient1)"
          className="font-logo text-5xl font-bold md:text-6xl capitalize"
        >
          {props.text}
        </text>
        {/* Text with Final Gradient */}
        <text
          x="50%"
          y="50%"
          alignmentBaseline="middle"
          textAnchor="middle"
          fill="url(#gradient2)"
          className="font-logo text-5xl font-bold md:text-6xl capitalize"
          mask="url(#mask)"
        >
          {props.text}
        </text>
      </svg>
    </div>
  );
}
