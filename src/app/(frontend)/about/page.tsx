import { getPayload } from 'payload'
import config from '@payload-config'
import HistoryTimeline, { TimelineHistory } from '@/components/About/HistoryTimeline';
import Footer from '@/components/Footer';
import Socials from '@/components/About/Socials';
import NextImage from 'next/image';
import { Image } from '../../../../payload-types';
import { PixelatedCanvas } from '@/components/ui/pixelated-canvas';
import { AsciiArt } from '@/components/ui/ascii-art';

export const dynamic = 'force-dynamic';

export default async function Social() {
    const payload = await getPayload({ config })
    const users = await payload.find({ collection: "users" })
    const primaryUser = users.docs[0]
    const primaryUserProfilePicture = users.docs[0]['profile-picture'] as Image

    return (
        <div className='typeset typeset-docs'>
            <div className='pt-20 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto flex'>
                <div className='max-w-sm'>
                    <h1>Hey there, I'm {primaryUser.name}!</h1>
                    <p>This might be slightly arduous, but it's an about me section! These things tend to be a little tedious but it may be worthwhile if you're reading this.</p>
                    <Socials socials={primaryUser.socials!} />
                </div>
                <div className='w-full'>
                    <AsciiArt
                        src={primaryUserProfilePicture && primaryUserProfilePicture.url!}
                        charset="minimal"
                        resolution={200}
                        color="var(--color-muted-foreground)"
                        animationStyle="fade"
                        animationDuration={1.5}
                        animateOnView={false}
                        className="mx-auto aspect-square rounded-xl w-full max-w-lg bg-neutral-950"
                    />

                    {/* {<NextImage width={512} height={512} src={primaryUserProfilePicture && primaryUserProfilePicture.url} alt={primaryUserProfilePicture['alt-text']} />} */}
                </div>
            </div>
            <div>
                <HistoryTimeline history={primaryUser.history as TimelineHistory[]} summary={primaryUser.summary!} />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}