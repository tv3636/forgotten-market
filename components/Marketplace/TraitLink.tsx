import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { BURN_TRAITS } from "./marketplaceConstants";
import { SoftLink } from "./marketplaceHelpers";

export default function TraitLink({
  trait,
  value,
  children,
}: {
  trait: string;
  value: any;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link href={ 
      BURN_TRAITS.includes(trait) ? 
        `/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${router.query.tokenId}`
        : `/${router.query.contractSlug}?${trait.toLowerCase().replace('#', '%23')}=${value.replaceAll(' ', '+')}`
      } 
      passHref={true}
    >
      <SoftLink>
        {children}
      </SoftLink>
    </Link>
  )
}
