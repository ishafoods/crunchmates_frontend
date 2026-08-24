import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Button, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { useStore } from '../../store/useStore'
import type { ShowcaseImage, SiteStat } from '../../types'

export function AdminContentPage() {
  const { content, updateContent } = useStore()
  const [heroTitle, setHeroTitle] = useState(content.heroTitle)
  const [heroSubtitle, setHeroSubtitle] = useState(content.heroSubtitle)
  const [announcement, setAnnouncement] = useState(content.announcement)
  const [storyText, setStoryText] = useState(content.storyText)
  const [statDraft, setStatDraft] = useState<SiteStat>({ label: '', value: '' })
  const [editingStatLabel, setEditingStatLabel] = useState<string | null>(null)
  const [showcaseDraft, setShowcaseDraft] = useState<ShowcaseImage>({ id: '', image: '', title: '', text: '' })
  const [editingShowcaseId, setEditingShowcaseId] = useState<string | null>(null)
  const [spiceMeterTitle, setSpiceMeterTitle] = useState(content.spiceMeterTitle)
  const [spiceMeterText, setSpiceMeterText] = useState(content.spiceMeterText)
  const [spiceMeterValue, setSpiceMeterValue] = useState(String(content.spiceMeterValue))
  const [spiceMeterStartLabel, setSpiceMeterStartLabel] = useState(content.spiceMeterStartLabel)
  const [spiceMeterEndLabel, setSpiceMeterEndLabel] = useState(content.spiceMeterEndLabel)
  const [snackMomentsTitle, setSnackMomentsTitle] = useState(content.snackMomentsTitle)
  const [snackMoments, setSnackMoments] = useState(content.snackMoments.join(', '))
  const [socialProofTitle, setSocialProofTitle] = useState(content.socialProofTitle)
  const [socialProofQuotes, setSocialProofQuotes] = useState(content.socialProofQuotes.join('\n'))
  const [newsletterTitle, setNewsletterTitle] = useState(content.newsletterTitle)
  const [newsletterText, setNewsletterText] = useState(content.newsletterText)
  const [newsletterCta, setNewsletterCta] = useState(content.newsletterCta)
  const [finalCtaTitle, setFinalCtaTitle] = useState(content.finalCtaTitle)
  const [finalCtaPrimary, setFinalCtaPrimary] = useState(content.finalCtaPrimary)
  const [finalCtaSecondary, setFinalCtaSecondary] = useState(content.finalCtaSecondary)
  const [blockDraft, setBlockDraft] = useState({ title: '', text: '', accent: '#ffb739' })
  const [blockImage, setBlockImage] = useState<string | undefined>()
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)

  const handleSaveHero = async (event: FormEvent) => {
    event.preventDefault()
    await updateContent({
      heroTitle, heroSubtitle, announcement, storyText,
      spiceMeterTitle, spiceMeterText, spiceMeterValue: Number(spiceMeterValue), spiceMeterStartLabel, spiceMeterEndLabel,
      snackMomentsTitle, snackMoments: snackMoments.split(',').map((item) => item.trim()).filter(Boolean),
      socialProofTitle, socialProofQuotes: socialProofQuotes.split('\n').map((item) => item.trim()).filter(Boolean),
      newsletterTitle, newsletterText, newsletterCta, finalCtaTitle, finalCtaPrimary, finalCtaSecondary,
    })
  }

  const handleStatImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setStatDraft((current) => ({ ...current, image: typeof reader.result === 'string' ? reader.result : undefined }))
    reader.readAsDataURL(file)
  }

  const saveStat = async () => {
    const label = statDraft.label.trim()
    const value = statDraft.value.trim()
    if (!label || !value) return

    const nextStat = { label, value, image: statDraft.image }
    const stats = editingStatLabel
      ? content.stats.map((stat) => (stat.label === editingStatLabel ? nextStat : stat))
      : [...content.stats, nextStat]
    await updateContent({ stats })
    setEditingStatLabel(null)
    setStatDraft({ label: '', value: '' })
  }

  const editStat = (stat: SiteStat) => {
    setEditingStatLabel(stat.label)
    setStatDraft(stat)
  }

  const deleteStat = async (label: string) => {
    if (!window.confirm(`Delete the ${label} stat?`)) return
    await updateContent({ stats: content.stats.filter((stat) => stat.label !== label) })
    if (editingStatLabel === label) {
      setEditingStatLabel(null)
      setStatDraft({ label: '', value: '' })
    }
  }

  const handleShowcaseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setShowcaseDraft((current) => ({ ...current, image: typeof reader.result === 'string' ? reader.result : '' }))
    reader.readAsDataURL(file)
  }

  const saveShowcaseImage = async () => {
    if (!showcaseDraft.title.trim() || !showcaseDraft.text.trim() || !showcaseDraft.image) return
    const item = { ...showcaseDraft, title: showcaseDraft.title.trim(), text: showcaseDraft.text.trim(), id: editingShowcaseId ?? `${Date.now()}` }
    const showcaseImages = editingShowcaseId
      ? content.showcaseImages.map((current) => (current.id === editingShowcaseId ? item : current))
      : [...content.showcaseImages, item]
    await updateContent({ showcaseImages })
    setEditingShowcaseId(null)
    setShowcaseDraft({ id: '', image: '', title: '', text: '' })
  }

  const editShowcaseImage = (item: ShowcaseImage) => {
    setEditingShowcaseId(item.id)
    setShowcaseDraft(item)
  }

  const deleteShowcaseImage = async (id: string) => {
    if (!window.confirm('Delete this showcase image?')) return
    await updateContent({ showcaseImages: content.showcaseImages.filter((item) => item.id !== id) })
  }

  const handleBlockImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBlockImage(typeof reader.result === 'string' ? reader.result : undefined)
    reader.readAsDataURL(file)
  }

  const addBlock = async () => {
    if (!blockDraft.title || !blockDraft.text) {
      return
    }

    const block = {
      id: editingBlockId ?? `${Date.now()}`,
      title: blockDraft.title,
      text: blockDraft.text,
      accent: blockDraft.accent,
      image: blockImage,
    }
    const blocks = editingBlockId
      ? content.blocks.map((item) => (item.id === editingBlockId ? block : item))
      : [...content.blocks, block]

    await updateContent({ blocks })
    setEditingBlockId(null)
    setBlockImage(undefined)
    setBlockDraft({ title: '', text: '', accent: '#ffb739' })
  }

  const editBlock = (block: (typeof content.blocks)[number]) => {
    setEditingBlockId(block.id)
    setBlockDraft({ title: block.title, text: block.text, accent: block.accent })
    setBlockImage(block.image)
  }

  const deleteBlock = async (blockId: string) => {
    if (!window.confirm('Delete this feature block?')) {
      return
    }

    await updateContent({ blocks: content.blocks.filter((block) => block.id !== blockId) })
    if (editingBlockId === blockId) {
      setEditingBlockId(null)
      setBlockDraft({ title: '', text: '', accent: '#ffb739' })
      setBlockImage(undefined)
    }
  }

  return (
    <div className="stack-lg">
      <section className="section-head compact">
        <div>
          <p className="section-kicker">Content</p>
          <h1>Edit the campaign copy and layout blocks.</h1>
        </div>
      </section>

      <section className="admin-two-column">
        <form className="panel admin-list stack-md" onSubmit={handleSaveHero}>
          <div className="content-editor-heading">
            <Typography variant="h5">Hero section</Typography>
            <Typography variant="body2" className="muted">The first section visitors see on the homepage.</Typography>
          </div>
          <div className="admin-content content-editor-group">
            <TextField className="span-2" label="Announcement" value={announcement} onChange={(event) => setAnnouncement(event.target.value)} />
            <TextField className="span-2" label="Hero title" multiline rows={3} value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} />
            <TextField className="span-2" label="Hero subtitle" multiline rows={6} value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} />
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Brand story</Typography>
            <Typography variant="body2" className="muted">The story section near the bottom of the homepage.</Typography>
          </div>
          <TextField className="span-2" label="Story text" multiline rows={6} value={storyText} onChange={(event) => setStoryText(event.target.value)} />
          <Button type="submit" className="primary-button" variant="contained" startIcon={<AddRoundedIcon />}>
            Save hero and story
          </Button>
        </form>

        <section className="panel admin-list stack-md stat-manager">
          <div className="content-editor-heading">
            <Typography variant="h5">Hero stats</Typography>
            <Typography variant="body2" className="muted">Add the quick facts displayed below the hero buttons.</Typography>
          </div>
          <div className="form-grid">
            <TextField label="Label" value={statDraft.label} onChange={(event) => setStatDraft({ ...statDraft, label: event.target.value })} />
            <TextField label="Value" value={statDraft.value} onChange={(event) => setStatDraft({ ...statDraft, value: event.target.value })} />
            <div className="span-2 stat-upload">
              <Typography variant="body2" className="muted">Stat image (optional)</Typography>
              <input type="file" accept="image/*" onChange={handleStatImage} />
              {statDraft.image && <img className="stat-upload__preview" src={statDraft.image} alt="Stat preview" />}
            </div>
          </div>
          <div className="hero-actions">
            <Button type="button" className="primary-button" variant="contained" onClick={() => void saveStat()} startIcon={<AddRoundedIcon />}>
              {editingStatLabel ? 'Update stat' : 'Add stat'}
            </Button>
            {editingStatLabel && (
              <Button type="button" onClick={() => { setEditingStatLabel(null); setStatDraft({ label: '', value: '' }) }}>
                Cancel
              </Button>
            )}
          </div>
          <div className="stat-list">
            {content.stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                {stat.image && <img className="stat-card__image" src={stat.image} alt="" />}
                <div className="stat-card__copy">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
                <div className="hero-actions compact-actions">
                  <Tooltip title="Edit stat">
                    <IconButton type="button" aria-label={`Edit ${stat.label}`} onClick={() => editStat(stat)}>
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete stat">
                    <IconButton type="button" className="block-action-button--danger" aria-label={`Delete ${stat.label}`} onClick={() => void deleteStat(stat.label)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel admin-list stack-md">
          <div className="content-editor-heading">
            <Typography variant="h5">Showcase images</Typography>
            <Typography variant="body2" className="muted">Manage the images and captions shown on the Showcase page.</Typography>
          </div>
          <div className="form-grid">
            <TextField className="span-2" label="Title" value={showcaseDraft.title} onChange={(event) => setShowcaseDraft({ ...showcaseDraft, title: event.target.value })} />
            <TextField className="span-2" label="Description" multiline rows={2} value={showcaseDraft.text} onChange={(event) => setShowcaseDraft({ ...showcaseDraft, text: event.target.value })} />
            <div className="span-2 stat-upload">
              <Typography variant="body2" className="muted">Image</Typography>
              <input type="file" accept="image/*" onChange={handleShowcaseImage} />
              {showcaseDraft.image && <img className="stat-upload__preview" src={showcaseDraft.image} alt="Showcase preview" />}
            </div>
          </div>
          <div className="hero-actions">
            <Button type="button" className="primary-button" variant="contained" onClick={() => void saveShowcaseImage()} startIcon={<AddRoundedIcon />}>
              {editingShowcaseId ? 'Update image' : 'Add image'}
            </Button>
            {editingShowcaseId && <Button type="button" onClick={() => { setEditingShowcaseId(null); setShowcaseDraft({ id: '', image: '', title: '', text: '' }) }}>Cancel</Button>}
          </div>
          <div className="feature-list">
            {content.showcaseImages.map((item) => (
              <article key={item.id} className="feature-card compact showcase-admin-card">
                <img src={item.image} alt="" className="showcase-admin-card__image" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="hero-actions compact-actions">
                  <Tooltip title="Edit image"><IconButton type="button" aria-label={`Edit ${item.title}`} onClick={() => editShowcaseImage(item)}><EditRoundedIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete image"><IconButton type="button" className="block-action-button--danger" aria-label={`Delete ${item.title}`} onClick={() => void deleteShowcaseImage(item.id)}><DeleteOutlineRoundedIcon /></IconButton></Tooltip>
                </div>
              </article>
            ))}
          </div>
        </section>

        <form className="panel admin-form" onSubmit={handleSaveHero}>
          <div className="content-editor-heading">
            <Typography variant="h5">Homepage sections</Typography>
            <Typography variant="body2" className="muted">Edit each section in the same order it appears on the homepage.</Typography>
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Spice meter</Typography>
          </div>
          <div className="form-grid content-editor-group">
            <TextField className="span-2" label="Spice meter title" value={spiceMeterTitle} onChange={(event) => setSpiceMeterTitle(event.target.value)} />
            <TextField className="span-2" label="Spice meter text" multiline rows={2} value={spiceMeterText} onChange={(event) => setSpiceMeterText(event.target.value)} />
            <TextField label="Spice meter value" type="number" slotProps={{ htmlInput: { min: 0, max: 100 } }} value={spiceMeterValue} onChange={(event) => setSpiceMeterValue(event.target.value)} />
            <TextField label="Meter start label" value={spiceMeterStartLabel} onChange={(event) => setSpiceMeterStartLabel(event.target.value)} />
            <TextField label="Meter end label" value={spiceMeterEndLabel} onChange={(event) => setSpiceMeterEndLabel(event.target.value)} />
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Snack moments</Typography>
          </div>
          <div className="form-grid content-editor-group">
            <TextField className="span-2" label="Snack moments title" value={snackMomentsTitle} onChange={(event) => setSnackMomentsTitle(event.target.value)} />
            <TextField className="span-2" label="Snack moments (comma separated)" value={snackMoments} onChange={(event) => setSnackMoments(event.target.value)} />
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Social proof</Typography>
          </div>
          <div className="form-grid content-editor-group">
            <TextField className="span-2" label="Social proof title" value={socialProofTitle} onChange={(event) => setSocialProofTitle(event.target.value)} />
            <TextField className="span-2" label="Social proof quotes (one per line)" multiline rows={3} value={socialProofQuotes} onChange={(event) => setSocialProofQuotes(event.target.value)} />
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Newsletter</Typography>
          </div>
          <div className="form-grid content-editor-group">
            <TextField label="Newsletter title" value={newsletterTitle} onChange={(event) => setNewsletterTitle(event.target.value)} />
            <TextField label="Newsletter button" value={newsletterCta} onChange={(event) => setNewsletterCta(event.target.value)} />
            <TextField className="span-2" label="Newsletter text" value={newsletterText} onChange={(event) => setNewsletterText(event.target.value)} />
          </div>
          <div className="content-editor-heading content-editor-heading--separated">
            <Typography variant="h6">Final call to action</Typography>
          </div>
          <div className="form-grid content-editor-group">
            <TextField className="span-2" label="Final CTA title" value={finalCtaTitle} onChange={(event) => setFinalCtaTitle(event.target.value)} />
            <TextField label="Final CTA primary button" value={finalCtaPrimary} onChange={(event) => setFinalCtaPrimary(event.target.value)} />
            <TextField label="Final CTA secondary button" value={finalCtaSecondary} onChange={(event) => setFinalCtaSecondary(event.target.value)} />
          </div>
          <Button type="submit" className="primary-button" variant="contained" startIcon={<AddRoundedIcon />}>Save homepage content</Button>
        </form>

        <div className="panel admin-list stack-md">
          <div className="content-editor-heading">
            <Typography variant="h5">Feature strip</Typography>
            <Typography variant="body2" className="muted">Cards shown below the hero section on the homepage.</Typography>
          </div>
          <div className="form-grid">
            <TextField
              className="color-picker-field"
              label="Accent"
              type="color"
              value={blockDraft.accent}
              onChange={(event) => setBlockDraft({ ...blockDraft, accent: event.target.value })}
              slotProps={{ htmlInput: { 'aria-label': 'Feature block accent color' } }}
            />
            <TextField className="span-2" label="Title" value={blockDraft.title} onChange={(event) => setBlockDraft({ ...blockDraft, title: event.target.value })} />
            <TextField className="span-2" label="Text" multiline rows={4} value={blockDraft.text} onChange={(event) => setBlockDraft({ ...blockDraft, text: event.target.value })} />
            <div className="span-2">
              <Typography sx={{ mb: 1 }}>Corner image</Typography>
              <input type="file" accept="image/*" onChange={handleBlockImage} />
            </div>
          </div>

          <Button type="button" className="primary-button" variant="contained" onClick={addBlock} startIcon={<AddRoundedIcon />}>
            {editingBlockId ? 'Save block' : 'Add block'}
          </Button>

          <div className="feature-list">
            {content.blocks.map((block) => (
              <article
                key={block.id}
                className="feature-card compact"
                style={{ ['--feature-accent' as string]: block.accent }}
              >
                <span className="feature-dot" />
                <h3>{block.title}</h3>
                <p>{block.text}</p>
                <div className="hero-actions compact-actions">
                  <Tooltip title="Edit block">
                    <IconButton
                      type="button"
                      className="block-action-button"
                      aria-label={`Edit ${block.title}`}
                      onClick={() => editBlock(block)}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete block">
                    <IconButton
                      type="button"
                      className="block-action-button block-action-button--danger"
                      aria-label={`Delete ${block.title}`}
                      onClick={() => void deleteBlock(block.id)}
                    >
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
