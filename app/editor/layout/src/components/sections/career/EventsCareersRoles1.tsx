"use client";



import Link from "next/link";



import type { EventsCareersRoleData, SectionProps } from "../../../types/section";



export default function EventsCareersRoles1({ data = {} }: SectionProps) {

  const roles = (data.roles ?? []) as EventsCareersRoleData[];

  const applyLabel = data.rolesApplyLabel ?? "Apply Now";



  return (

    <section

      data-editor-section-label="Open Roles"

      data-editor-fields="rolesPretitle rolesTitle roles rolesApplyLabel"

      className="mt-8 bg-[#fff5f8] py-8 md:mt-10 md:py-10 lg:mt-14 lg:py-14"

    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">

          {(data.rolesPretitle ?? "OPEN ROLES") && (

            <p

              data-editor-field="rolesPretitle"

              className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#d61b58]"

            >

              {data.rolesPretitle ?? "OPEN ROLES"}

            </p>

          )}

          {(data.rolesTitle ?? "Current opportunities we're hiring for") && (

            <h2

              data-editor-field="rolesTitle"

              className="text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-4xl"

            >

              {data.rolesTitle ?? "Current opportunities we're hiring for"}

            </h2>

          )}

        </div>



        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {roles.map((role, index) => (

            <div

              key={role.id ?? `${role.title}-${index}`}

              className="group rounded-xl border border-[#f4d4e1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"

            >

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                <div>

                  <p className="text-base font-semibold text-slate-900 sm:text-lg">

                    {role.title}

                  </p>

                  {(role.location || role.type) && (

                    <p className="mt-1 text-xs uppercase tracking-[0.1em] text-[#d61b58]">

                      {[role.location, role.type].filter(Boolean).join(" · ")}

                    </p>

                  )}

                </div>

                {role.type && (

                  <span className="rounded-full bg-[#fde8ef] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d61b58]">

                    {role.type}

                  </span>

                )}

              </div>



              {role.description && (

                <p className="mb-4 text-sm leading-5 text-slate-600">

                  {role.description}

                </p>

              )}



              <Link

                href={role.applyHref ?? "#"}

                className="inline-flex items-center gap-2 text-sm font-semibold text-[#d61b58] hover:text-[#b01648]"

              >

                {applyLabel}

                <span aria-hidden="true">→</span>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}

