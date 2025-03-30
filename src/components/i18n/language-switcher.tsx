'use client';

import { languages, locales, type Locale } from '@/config/i18n';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = (pathname?.split('/')[1] as Locale) || 'fr';

    const handleLanguageChange = (newLocale: Locale) => {
        const newPath = pathname?.replace(`/${currentLocale}`, '') || '/';
        router.push(`/${newLocale}${newPath}`);
    };

    return (
        <Select
            defaultValue={currentLocale}
            onValueChange={handleLanguageChange}
        >
            <SelectTrigger
                className='w-fit h-8 gap-2'
                aria-label='Select Language'
            >
                <SelectValue placeholder='Select language' />
            </SelectTrigger>
            <SelectContent>
                {locales.map((locale) => (
                    <SelectItem
                        key={locale}
                        value={locale}
                        className='flex items-center gap-2'
                    >
                        <div className='flex items-center gap-2'>
                            <Image
                                src={`/icons/flag_${locale}.png`}
                                alt={languages[locale]}
                                width={20}
                                height={15}
                                className='object-cover'
                            />
                            <span className='font-medium'>
                                {languages[locale]}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
