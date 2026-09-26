"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiTag,
} from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { isUnoptimizedImageSrc } from "../../../lib/media";

type Story = {
  name?: string;
  title?: string;
  story?: string;
  image?: string;
  category?: string;
  age?: string;
  location?: string;
  year?: string;
  before?: string;
  after?: string;
};

type TitleShape = { line1?: string; highlight?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export default function NGOSuccessStories2({ data = {} }: SectionProps) {
  const badge = isRecord(data.badge) ? data.badge : undefined;
  const title = (isRecord(data.title) ? data.title : {}) as TitleShape;
  const pretitle =
    (typeof data.pretitle === "string" && data.pretitle) ||
    (typeof data.description === "string" && data.description) ||
    "";
  const stories = (Array.isArray(data.stories)
    ? data.stories
    : Array.isArray(data.cards)
      ? data.cards
      : []) as Story[];

  const [activeIndex, setActiveIndex] = useState(0);
  const story = stories[activeIndex];

  if (!stories.length) return null;

  const nextStory = () =>
    setActiveIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  const previousStory = () =>
    setActiveIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));

  return (
    <section
      data-editor-section-label="Success Stories"
      data-editor-fields="badge title pretitle stories"
      className="relative overflow-hidden bg-white pb-4 pt-8 md:pt-12"
    >
      <div className="mx-auto max-w-7xl px-2 md:px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex px-5 pt-2 text-sm font-semibold text-orange-700">
            {(badge?.label as string) || "Success Stories"}
          </span>
          <h2 className="mt-0 text-3xl font-bold text-gray-900 md:text-5xl">
            {title.line1 ||
              (typeof data.title === "string" ? data.title : "Lives We've")}{" "}
            <span className="text-yellow-600">
              {title.highlight || "Changed"}
            </span>
          </h2>
          {pretitle ? (
            <p className="mt-1 text-sm text-gray-900 md:text-base">
              {pretitle}
            </p>
          ) : null}
        </div>

        <div className="relative mt-5">
          <button
            type="button"
            onClick={previousStory}
            aria-label="Previous Story"
            className="absolute -left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-gray-100 lg:-left-6"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <button
            type="button"
            onClick={nextStory}
            aria-label="Next Story"
            className="absolute -right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-100 lg:-right-6"
          >
            <FiArrowRight className="text-xl" />
          </button>

          <div className="grid items-center gap-10 px-2 md:grid-cols-2 md:px-12">
            <div className="relative mx-auto h-[380px] w-full max-w-md overflow-hidden rounded-3xl shadow-lg">
              {story?.image ? (
                <Image
                  src={story.image}
                  alt={story.name || story.title || "Success story"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 450px"
                  unoptimized={isUnoptimizedImageSrc(story.image)}
                />
              ) : null}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {story?.category ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                    <FiTag className="text-yellow-600" />
                    {story.category}
                  </span>
                ) : null}
                {story?.age ? <span>{story.age}</span> : null}
                {story?.location ? (
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-yellow-600" />
                    {story.location}
                  </span>
                ) : null}
                {story?.year ? (
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-yellow-600" />
                    {story.year}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 md:mt-4 md:text-3xl">
                {story?.title}
              </h3>
              <p className="mt-2 text-gray-900 md:mt-4 md:leading-relaxed">
                {story?.story}
              </p>
              {(story?.before || story?.after) ? (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {story.before ? (
                    <div className="rounded-2xl bg-orange-50 p-4">
                      <p className="text-xs font-semibold uppercase text-orange-600">
                        Before
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{story.before}</p>
                    </div>
                  ) : null}
                  {story.after ? (
                    <div className="rounded-2xl bg-green-50 p-4">
                      <p className="text-xs font-semibold uppercase text-green-700">
                        After
                      </p>
                      <p className="mt-1 text-sm text-slate-700">{story.after}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
